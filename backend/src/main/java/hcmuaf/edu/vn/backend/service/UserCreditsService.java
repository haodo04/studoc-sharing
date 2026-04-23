package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.UserCredits;
import hcmuaf.edu.vn.backend.repository.UserCreditsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCreditsService {

    private final UserCreditsRepository userCreditsRepository;

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

}
