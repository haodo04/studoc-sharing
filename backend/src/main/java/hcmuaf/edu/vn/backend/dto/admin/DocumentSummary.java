package hcmuaf.edu.vn.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentSummary {
    private String id;
    private String title;
    private String uploaderId;
    private String categoryName;
    private LocalDateTime uploadedAt;
}
