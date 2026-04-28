package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.UserCredits;
import hcmuaf.edu.vn.backend.repository.ProfileRepository;
import hcmuaf.edu.vn.backend.repository.UserCreditsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserCreditsService {

    private final UserCreditsRepository userCreditsRepository;
    private final ProfileService profileService;

    public UserCredits createInitialCredits(String clerkId) {

        if (userCreditsRepository.existsByClerkId(clerkId)) {
            return userCreditsRepository.findByClerkId(clerkId);
        }

        UserCredits userCredits = UserCredits.builder()
                .clerkId(clerkId)
                .credits(5)
                .plan("BASIC")
                .build();

        return userCreditsRepository.save(userCredits);
    }

    public void deleteUserCredits(String clerkId) {
        if (userCreditsRepository.existsByClerkId(clerkId)) {
            userCreditsRepository.deleteByClerkId(clerkId);
        }
    }

    //    public UserCredits getUserCredits(String clerkId) {
//        return userCreditsRepository.findByClerkId(clerkId)
//                .orElseGet(() -> createInitialCredits(clerkId));
//    }
    public UserCredits getUserCredits(String clerkId) {
        return Optional.ofNullable(userCreditsRepository.findByClerkId(clerkId))
                .orElseGet(() -> createInitialCredits(clerkId));
    }

    public UserCredits getUserCredits() {
        String clerkId = profileService.getCurrentProfile().getClerkId();
        return getUserCredits(clerkId);
    }

    public Boolean hasEnoughCredits(int requiredCredits) {
        UserCredits userCredits = getUserCredits();
        return userCredits.getCredits() >= requiredCredits;
    }

    public UserCredits consumeCredits() {
        UserCredits userCredits = getUserCredits();

        if (userCredits.getCredits() <= 0) {
            return null;
        }

        userCredits.setCredits(userCredits.getCredits() - 1);
        return userCreditsRepository.save(userCredits);
    }

}
