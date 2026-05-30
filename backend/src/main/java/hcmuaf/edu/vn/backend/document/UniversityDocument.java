package hcmuaf.edu.vn.backend.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "universities")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UniversityDocument {
    @Id
    private String id;           // Ví dụ: "HUST", "NEU", "FTU"
    private String name;         // Tên đầy đủ: "Đại học Bách Khoa Hà Nội"
    private String shortName;    // Tên viết tắt: "BKHN"
    private String logoUrl;      // Ảnh logo trường
    private boolean isFeatured;  // Trường nổi bật (hiển thị ưu tiên ở trang chủ)
}
