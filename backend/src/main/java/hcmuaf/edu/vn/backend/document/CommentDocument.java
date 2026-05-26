package hcmuaf.edu.vn.backend.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "comments")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentDocument {
    @Id
    private String id;
    private String fileId;       // Thuộc về tài liệu nào
    private String clerkId;      // Người bình luận
    private String userFullName; // Lưu trực tiếp tên để FE hiển thị ngay, đỡ phải query lại bảng Profile
    private String userPhotoUrl; // Lưu URL ảnh đại diện của người bình luận
    private String content;      // Nội dung bình luận
    private int rating;          // Số sao đánh giá (từ 1 đến 5)
    private LocalDateTime createdAt;
}
