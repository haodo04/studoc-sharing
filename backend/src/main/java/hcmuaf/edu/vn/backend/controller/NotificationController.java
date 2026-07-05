package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.document.NotificationDocument;
import hcmuaf.edu.vn.backend.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationDocument>> getMine(
            @RequestParam(defaultValue = "20") int limit,
            HttpServletRequest request) {
        String clerkId = (String) request.getAttribute("clerkId");
        return ResponseEntity.ok(notificationService.getForUser(clerkId, limit));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> unreadCount(HttpServletRequest request) {
        String clerkId = (String) request.getAttribute("clerkId");
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(clerkId)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable String id, HttpServletRequest request) {
        String clerkId = (String) request.getAttribute("clerkId");
        notificationService.markAsRead(id, clerkId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllRead(HttpServletRequest request) {
        String clerkId = (String) request.getAttribute("clerkId");
        notificationService.markAllAsRead(clerkId);
        return ResponseEntity.noContent().build();
    }
}