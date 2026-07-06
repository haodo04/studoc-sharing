package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.document.AssistantChatSessionDocument;
import hcmuaf.edu.vn.backend.service.SiteAssistantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/assistant/sessions")
@RequiredArgsConstructor
public class SiteAssistantController {

    private final SiteAssistantService siteAssistantService;

    private String resolveOwnerKey(Principal principal, String deviceId) {
        if (principal != null) return "user:" + principal.getName();
        if (deviceId == null || deviceId.isBlank()) {
            throw new IllegalArgumentException("Thiếu định danh thiết bị cho khách vãng lai");
        }
        return "device:" + deviceId;
    }

    @GetMapping
    public ResponseEntity<?> list(Principal principal, @RequestHeader(value = "X-Device-Id", required = false) String deviceId) {
        try {
            String ownerKey = resolveOwnerKey(principal, deviceId);
            return ResponseEntity.ok(siteAssistantService.listSessions(ownerKey));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(Principal principal, @RequestHeader(value = "X-Device-Id", required = false) String deviceId) {
        try {
            String ownerKey = resolveOwnerKey(principal, deviceId);
            return ResponseEntity.ok(siteAssistantService.createSession(ownerKey));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<?> detail(@PathVariable String sessionId, Principal principal,
                                    @RequestHeader(value = "X-Device-Id", required = false) String deviceId) {
        try {
            String ownerKey = resolveOwnerKey(principal, deviceId);
            return ResponseEntity.ok(siteAssistantService.getSessionDetail(sessionId, ownerKey));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{sessionId}/messages")
    public ResponseEntity<?> sendMessage(@PathVariable String sessionId,
                                         @RequestBody Map<String, String> body,
                                         Principal principal,
                                         @RequestHeader(value = "X-Device-Id", required = false) String deviceId) {
        try {
            String ownerKey = resolveOwnerKey(principal, deviceId);
            AssistantChatSessionDocument result = siteAssistantService.sendMessage(sessionId, ownerKey, body.get("message"));
            return ResponseEntity.ok(result);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<?> delete(@PathVariable String sessionId, Principal principal,
                                    @RequestHeader(value = "X-Device-Id", required = false) String deviceId) {
        try {
            String ownerKey = resolveOwnerKey(principal, deviceId);
            siteAssistantService.deleteSession(sessionId, ownerKey);
            return ResponseEntity.ok(Map.of("message", "Đã xoá cuộc trò chuyện"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }
}