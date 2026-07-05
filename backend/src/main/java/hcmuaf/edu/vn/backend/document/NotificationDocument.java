package hcmuaf.edu.vn.backend.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class NotificationDocument {
    @Id
    private String id;
    private String recipientClerkId;  // ai nhận thông báo này
    private String type;              // "DISCUSSION_REPLY" - sẽ mở rộng thêm loại khác sau
    private String message;           // nội dung hiển thị, dựng sẵn ở BE cho gọn FE
    private String fileId;            // để FE biết điều hướng tới tài liệu nào
    private String discussionId;      // id của comment/reply liên quan
    private String actorClerkId;      // ai gây ra hành động (người trả lời)
    private String actorFullName;
    private String actorPhotoUrl;
    private boolean isRead;
    private LocalDateTime createdAt;
}