package hcmuaf.edu.vn.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DocumentResponseDTO {
    private String id;
    private String title;
    private String description;

    // Phân loại
    private String docType;
    private String categoryId;

    // Nguồn gốc
    private String universityCode;
    private String subjectCode;

    // Tương tác & Trả phí
    private Integer creditCost;
    private Double rating;
    private Integer downloadCount;

    // Hình ảnh
    private String thumbnailUrl;
}
