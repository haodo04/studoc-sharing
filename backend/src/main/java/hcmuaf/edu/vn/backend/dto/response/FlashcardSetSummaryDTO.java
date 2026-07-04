package hcmuaf.edu.vn.backend.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FlashcardSetSummaryDTO {
    private String id;
    private int numCards;
    private String language;
    private String status;
    private String errorMessage;
    private LocalDateTime createdAt;
    private int knownCount;
}