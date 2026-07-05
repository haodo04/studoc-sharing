package hcmuaf.edu.vn.backend.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CollectionSummaryDTO {
    private String id;
    private String name;
    private int fileCount;
    private LocalDateTime createdAt;
}