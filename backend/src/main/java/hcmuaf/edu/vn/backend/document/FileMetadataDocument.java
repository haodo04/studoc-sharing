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
    private String title;         // Tiêu đề tài liệu hiển thị (ví dụ: "Bộ đề thi cuối kỳ môn Giải tích 1...")
    private String type;          // "pdf", "docx", "pptx"
    private long size;
    private String clerkId;       // ID người tải lên (Tác giả)
    private Boolean isPublic;     // Mặc định true để hiện trên trang Explore
    private String fileLocation;
    private LocalDateTime uploadedAt;

    private String universityId;  // Khóa ngoại liên kết tới bảng bảng Universities (ví dụ: "HUST")
    private String subjectCode;   // Mã môn học (ví dụ: "MI1110")
    private String subjectName;   // Tên môn học (ví dụ: "Giải tích 1")
    private String categoryId;    // Khóa ngoại liên kết tới bảng Categories (ví dụ: "toan-khoa-hoc")
    private String docType;       // Phân loại: "Đề thi", "Bài tập", "Bài giảng", "Tóm tắt"
    private String description;   // Mô tả chi tiết tài liệu
    private int pageCount;        // Số trang của tài liệu
    private Integer creditCost;   // Chi phí tải file (Số xu, mặc định: 0)

    private int viewCount;        // Số lượt xem
    private int downloadCount;    // Số lượt tải xuống
    private double rating;        // Điểm đánh giá trung bình (ví dụ: 4.8)
    private int reviewCount;      // Tổng số lượt đánh giá
}