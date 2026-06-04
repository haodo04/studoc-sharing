package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.UserCredits;
import hcmuaf.edu.vn.backend.exceptions.BadRequestException;
import hcmuaf.edu.vn.backend.exceptions.UnauthorizedException;
import hcmuaf.edu.vn.backend.repository.UserCreditsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserCreditsService {

    private final UserCreditsRepository userCreditsRepository;
    private final ProfileService profileService;

    public UserCredits createInitialCredits(String clerkId) {
        return userCreditsRepository.findByClerkId(clerkId)
                .orElseGet(() -> {
                    UserCredits initialCredits = UserCredits.builder()
                            .clerkId(clerkId)
                            .credits(5)
                            .plan("BASIC")
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

    public void deductCreditsForDownload(int amount) {
        UserCredits userCredits = getUserCredits();

        if (userCredits.getCredits() < amount) {
            throw new BadRequestException("Tài khoản của bạn không đủ xu. Vui lòng nạp thêm!");
        }

        userCredits.setCredits(userCredits.getCredits() - amount);
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
                                    .plan("BASIC")
                                    .build();
                            userCreditsRepository.save(newCredits);
                        }
                );
    }
}
