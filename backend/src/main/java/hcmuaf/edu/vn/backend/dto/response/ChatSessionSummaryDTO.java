package hcmuaf.edu.vn.backend.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ChatSessionSummaryDTO {
    private String id;
    private String title;
    private LocalDateTime updatedAt;
    private int messageCount;
}