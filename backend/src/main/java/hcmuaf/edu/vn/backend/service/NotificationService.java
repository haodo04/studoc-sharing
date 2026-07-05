package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.NotificationDocument;
import hcmuaf.edu.vn.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public void notifyDiscussionReply(String recipientClerkId, String fileId, String discussionId,
                                      String actorClerkId, String actorFullName, String actorPhotoUrl) {
        // không tự thông báo cho chính mình khi tự reply comment của mình
        if (recipientClerkId.equals(actorClerkId)) return;

        NotificationDocument noti = NotificationDocument.builder()
                .recipientClerkId(recipientClerkId)
                .type("DISCUSSION_REPLY")
                .message(actorFullName + " đã trả lời câu hỏi của bạn")
                .fileId(fileId)
                .discussionId(discussionId)
                .actorClerkId(actorClerkId)
                .actorFullName(actorFullName)
                .actorPhotoUrl(actorPhotoUrl)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        NotificationDocument saved = notificationRepository.save(noti);

        // đẩy real-time nếu người nhận đang online; nếu offline thì vẫn đã lưu DB, họ thấy khi load lại
        messagingTemplate.convertAndSendToUser(recipientClerkId, "/queue/notifications", saved);
    }

    public List<NotificationDocument> getForUser(String clerkId, int limit) {
        return notificationRepository.findByRecipientClerkIdOrderByCreatedAtDesc(clerkId, PageRequest.of(0, limit));
    }

    public long getUnreadCount(String clerkId) {
        return notificationRepository.countByRecipientClerkIdAndIsReadFalse(clerkId);
    }

    public void markAsRead(String id, String clerkId) {
        NotificationDocument noti = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Thông báo không tồn tại"));
        if (!noti.getRecipientClerkId().equals(clerkId)) {
            throw new SecurityException("Bạn không có quyền với thông báo này");
        }
        noti.setRead(true);
        notificationRepository.save(noti);
    }

    public void markAllAsRead(String clerkId) {
        List<NotificationDocument> unread = notificationRepository.findByRecipientClerkIdAndIsReadFalse(clerkId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}