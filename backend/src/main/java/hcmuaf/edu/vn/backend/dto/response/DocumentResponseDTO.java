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

    private String docType;
    private String categoryId;

    private String universityCode;
    private String subjectCode;

    private Integer creditCost;
    private Double rating;
    private Integer downloadCount;

    private String thumbnailUrl;
}
