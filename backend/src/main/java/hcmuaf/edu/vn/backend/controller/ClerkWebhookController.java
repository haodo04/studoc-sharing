package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.dto.ProfileDTO;
import hcmuaf.edu.vn.backend.service.ProfileService;
import hcmuaf.edu.vn.backend.service.UserCreditsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

@RestController
@RequestMapping("/webhooks")
@RequiredArgsConstructor
public class ClerkWebhookController {

    @Value("${clerk.webhook.secret}")
    private String webhookSecret;

    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;

    @PostMapping("clerk")
    public ResponseEntity<?> handleClerkWebhook(@RequestHeader("svix-id") String svixId,
                                                @RequestHeader("svix-timestamp") String svixTimestamp,
                                                @RequestHeader("svix-signature") String svixSignature,
                                                @RequestBody String payload) {
        try {
            boolean isValid = verifyWebhookSignature(svixId, svixTimestamp, svixSignature, payload);
            if (!isValid) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid webhook signature");
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(payload);
            String eventType = rootNode.path("type").asText();

            switch (eventType) {
                case "user.created":
                    handleUserCreated(rootNode.path("data"));
                    break;
                case "user.updated":
                    handleUserUpdated(rootNode.path("data"));
                    break;
                case "user.deleted":
                    handleUserDeleted(rootNode.path("data"));
                    break;
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
    }

    private void handleUserDeleted(JsonNode data) {
        String clerkId = data.path("id").asText();
        profileService.deleteProfile(clerkId);
        userCreditsService.deleteUserCredits(clerkId);
    }

    private void handleUserUpdated(JsonNode data) {
        String clerkId = data.path("id").asText();

        String email = "";
        JsonNode emailAddresses = data.path("email_addresses");
        if (emailAddresses.isArray() && emailAddresses.size() > 0) {
            email = emailAddresses.get(0).path("email_address").asText();
        }
        String firstName = data.path("first_name").asText("");
        String lastName = data.path("last_name").asText("");
        String photoUrl = data.path("image_url").asText("");

        ProfileDTO profileDTO = ProfileDTO.builder()
                .clerkId(clerkId)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .photoUrl(photoUrl)
                .build();

        try {
            profileService.updateProfile(profileDTO);
        } catch (Exception e) {
            handleUserCreated(data);
        }
    }

    private void handleUserCreated(JsonNode data) {
        String clerkId = data.path("id").asText();

        String email = "";
        JsonNode emailAddresses = data.path("email_addresses");
        if (emailAddresses.isArray() && emailAddresses.size() > 0) {
            email = emailAddresses.get(0).path("email_address").asText();
        }
        String firstName = data.path("first_name").asText("");
        String lastName = data.path("last_name").asText("");
        String photoUrl = data.path("image_url").asText("");

        ProfileDTO newProfile = ProfileDTO.builder()
                .clerkId(clerkId)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .photoUrl(photoUrl)
                .build();

        profileService.createProfile(newProfile);
        userCreditsService.createInitialCredits(clerkId);
    }

    private boolean verifyWebhookSignature(String svixId, String svixTimestamp, String svixSignature, String payload) {
        try {
            String secret = webhookSecret.startsWith("whsec_") ? webhookSecret.substring(6) : webhookSecret;
            byte[] secretBytes = Base64.getDecoder().decode(secret);

            String signedContent = svixId + "." + svixTimestamp + "." + payload;

            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secretBytes, "HmacSHA256"));
            byte[] computedHash = mac.doFinal(signedContent.getBytes(StandardCharsets.UTF_8));
            String expectedSignature = Base64.getEncoder().encodeToString(computedHash);

            for (String versioned : svixSignature.split(" ")) {
                String[] parts = versioned.split(",", 2);
                if (parts.length == 2 && "v1".equals(parts[0])
                        && MessageDigest.isEqual(
                        parts[1].getBytes(StandardCharsets.UTF_8),
                        expectedSignature.getBytes(StandardCharsets.UTF_8))) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            System.err.println(">>> [ClerkWebhook] Lỗi xác thực chữ ký: " + e.getMessage());
            return false;
        }
    }
}