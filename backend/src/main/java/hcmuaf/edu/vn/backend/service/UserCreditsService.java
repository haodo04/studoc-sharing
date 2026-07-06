package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.ProfileDocument;
import hcmuaf.edu.vn.backend.document.UserCredits;
import hcmuaf.edu.vn.backend.exceptions.BadRequestException;
import hcmuaf.edu.vn.backend.exceptions.ResourceNotFoundException;
import hcmuaf.edu.vn.backend.exceptions.UnauthorizedException;
import hcmuaf.edu.vn.backend.repository.ProfileRepository;
import hcmuaf.edu.vn.backend.repository.UserCreditsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserCreditsService {

    public static final String PLAN_BASIC = "BASIC";
    public static final String PLAN_PREMIUM_MONTH = "Premium Tháng";
    public static final String PLAN_PREMIUM_YEAR = "Premium Năm";

    private final UserCreditsRepository userCreditsRepository;
    private final ProfileService profileService;
    private final ProfileRepository profileRepository;

    public UserCredits createInitialCredits(String clerkId) {
        return userCreditsRepository.findByClerkId(clerkId)
                .orElseGet(() -> {
                    UserCredits initialCredits = UserCredits.builder()
                            .clerkId(clerkId)
                            .credits(5)
                            .plan(PLAN_BASIC)
                            .build();

                    return userCreditsRepository.save(initialCredits);
                });
    }

    public void deleteUserCredits(String clerkId) {
        if (userCreditsRepository.existsByClerkId(clerkId)) {
            userCreditsRepository.deleteByClerkId(clerkId);
        }
    }

    public UserCredits getUserCredits(String clerkId) {
        if (clerkId == null || clerkId.trim().isEmpty()) {
            throw new BadRequestException("Mã định danh không hợp lệ!");
        }
        return userCreditsRepository.findByClerkId(clerkId)
                .orElseGet(() -> createInitialCredits(clerkId));
    }

    public UserCredits getUserCredits() {
        try {
            String clerkId = profileService.getCurrentProfile().getClerkId();
            return getUserCredits(clerkId);
        } catch (Exception e) {
            org.springframework.security.core.Authentication authentication =
                    org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.getPrincipal() != null) {
                String clerkIdFromToken = authentication.getName();
                return getUserCredits(clerkIdFromToken);
            }

            throw new UnauthorizedException("Tài khoản chưa được xác thực hệ thống!");
        }
    }

    @Transactional
    public void deductCreditsForDownload(String clerkId, int amount) {
        UserCredits userCredits = userCreditsRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin ví của người dùng này trong hệ thống!"));

        int currentCredits = userCredits.getCredits() != null ? userCredits.getCredits() : 0;

        if (currentCredits < amount) {
            throw new BadRequestException("Tài khoản của bạn không đủ xu. Vui lòng nạp thêm!");
        }

        userCredits.setCredits(currentCredits - amount);
        userCreditsRepository.save(userCredits);
    }

    @Transactional
    public void addCredits(String clerkId, int amount) {
        userCreditsRepository.findByClerkId(clerkId)
                .ifPresentOrElse(
                        userCredits -> {
                            int currentCredits = userCredits.getCredits() != null ? userCredits.getCredits() : 0;
                            userCredits.setCredits(currentCredits + amount);
                            userCreditsRepository.save(userCredits);
                        },
                        () -> {
                            UserCredits newCredits = UserCredits.builder()
                                    .clerkId(clerkId)
                                    .credits(amount)
                                    .plan(PLAN_BASIC)
                                    .build();
                            userCreditsRepository.save(newCredits);
                        }
                );
    }

    @Transactional
    public String getEffectivePlan(String clerkId) {
        UserCredits userCredits = getUserCredits(clerkId);
        String plan = userCredits.getPlan();
        LocalDateTime expiresAt = userCredits.getPlanExpiresAt();

        boolean isTimeLimitedPlan = PLAN_PREMIUM_MONTH.equals(plan) || PLAN_PREMIUM_YEAR.equals(plan);
        boolean isExpired = isTimeLimitedPlan && expiresAt != null && expiresAt.isBefore(LocalDateTime.now());

        if (isExpired) {
            userCredits.setPlan(PLAN_BASIC);
            userCredits.setPlanExpiresAt(null);
            userCreditsRepository.save(userCredits);
            return PLAN_BASIC;
        }
        return plan != null ? plan : PLAN_BASIC;
    }

    public boolean isPremiumYearActive(String clerkId) {
        return PLAN_PREMIUM_YEAR.equals(getEffectivePlan(clerkId));
    }
}