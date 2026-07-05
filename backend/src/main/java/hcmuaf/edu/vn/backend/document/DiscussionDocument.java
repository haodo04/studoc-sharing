package hcmuaf.edu.vn.backend.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "discussions")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DiscussionDocument {
    @Id
    private String id;
    private String fileId;         // Thuộc tài liệu nào
    private String parentId;       // null = bình luận gốc, khác null = reply lồng cho comment nào
    private String clerkId;        // Người viết
    private String userFullName;
    private String userPhotoUrl;
    private String content;
    private boolean isAuthorReply; // true nếu clerkId == chủ tài liệu -> FE hiện badge "Tác giả"
    private boolean deleted;       // soft-delete để giữ cây khi còn con
    private boolean edited;        // đánh dấu "đã chỉnh sửa" để FE hiện nhãn
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}