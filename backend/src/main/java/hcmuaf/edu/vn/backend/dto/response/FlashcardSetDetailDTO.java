package hcmuaf.edu.vn.backend.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FlashcardSetDetailDTO {
    private String id;
    private String language;
    private String status;
    private LocalDateTime createdAt;
    private List<CardDTO> cards;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CardDTO {
        private String id;
        private String front;
        private String back;
        private boolean known;
    }
}