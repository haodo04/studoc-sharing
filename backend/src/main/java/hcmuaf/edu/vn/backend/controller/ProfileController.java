package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.document.ProfileDocument;
import hcmuaf.edu.vn.backend.dto.ProfileDTO;
import hcmuaf.edu.vn.backend.service.ProfileService;
import hcmuaf.edu.vn.backend.service.UserCreditsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;

    @PostMapping("/register")
    public ResponseEntity<?> registerProfile(@RequestBody ProfileDTO profileDTO) {
        HttpStatus status = profileService.existsByClerkId(profileDTO.getClerkId()) ? HttpStatus.OK : HttpStatus.CREATED;
        ProfileDTO savedProfile = profileService.createProfile(profileDTO);
        userCreditsService.createInitialCredits(savedProfile.getClerkId());
        return ResponseEntity.status(status).body(savedProfile);
    }

    @GetMapping("/profiles")
    public ResponseEntity<?> getAllProfiles() {
        List<ProfileDTO> profiles = profileService.getAllProfiles();
        return ResponseEntity.ok(profiles);
    }

    @GetMapping("/profile/me")
    public ResponseEntity<?> getMyProfile() {
        try {
            ProfileDocument profile = profileService.getCurrentProfile();
            boolean isAdmin = profileService.isAdmin(profile);
            return ResponseEntity.ok(Map.of(
                    "clerkId", profile.getClerkId(),
                    "email", profile.getEmail(),
                    "role", isAdmin ? ProfileService.ROLE_ADMIN : ProfileService.ROLE_USER
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }
}