package hcmuaf.edu.vn.backend.document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "files")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class FileMetadataDocument {
    @Id
    private String id;
    private String name;          // Tên file gốc
    private String title;         // Tiêu đề tài liệu hiển thị
    private String type;          // "pdf", "docx", "pptx"
    private long size;
    private String clerkId;
    private Boolean isPublic;     // Mặc định true
    private String fileLocation;
    private LocalDateTime uploadedAt;

    private String universityId;
    private String subjectCode;   // Mã môn học
    private String subjectName;   // Tên môn học
    private String categoryId;
    private String customUniversity;
    private String customCategory;
    private String docType;       // Phân loại: "Đề thi", "Bài tập", "Bài giảng", "Tóm tắt"
    private String description;   // Mô tả chi tiết tài liệu
    private int pageCount;        // Số trang của tài liệu
    private Integer creditCost;   // Chi phí tải file (Số xu, mặc định: 0)

    private int viewCount;        // Số lượt xem
    private int downloadCount;    // Số lượt tải xuống
    private double rating;        // Điểm đánh giá trung bình
    private int reviewCount;      // Tổng số lượt đánh giá
    private String thumbnailUrl; // Đường dẫn lưu ảnh preview
    private String viewableUrl;
}