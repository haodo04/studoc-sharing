package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.document.UserCredits;
import hcmuaf.edu.vn.backend.dto.UserCreditsDTO;
import hcmuaf.edu.vn.backend.service.UserCreditsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hcmuaf.edu.vn.backend.repository.ProfileRepository;
import hcmuaf.edu.vn.backend.document.ProfileDocument;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserCreditsController {

    private final UserCreditsService userCreditsService;
    private final ProfileRepository profileRepository;

    @GetMapping("/me/status")
    public ResponseEntity<?> getUserStatus() {
        String clerkId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ProfileDocument p = profileRepository.findByClerkId(clerkId);
        boolean isBanned = p != null && Boolean.TRUE.equals(p.getIsBanned());
        return ResponseEntity.ok(Map.of("isBanned", isBanned));
    }

    @GetMapping("/credits")
    public ResponseEntity<?> getUserCredits() {
        UserCredits userCredits = userCreditsService.getUserCredits();
        UserCreditsDTO response = UserCreditsDTO.builder()
                .credits(userCredits.getCredits())
                .plan(userCredits.getPlan())
                .build();

        return ResponseEntity.ok(response);
    }
}
