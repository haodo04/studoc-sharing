package hcmuaf.edu.vn.backend.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "ai_flashcard_sets")
@AllArgsConstructor @NoArgsConstructor @Builder @Data
public class AiFlashcardSetDocument {
    @Id
    private String id;
    private String fileId;
    private String clerkId;
    private String language;
    private int numCards;
    private String status;
    private String errorMessage;
    private List<CardItem> cards;
    private LocalDateTime createdAt;

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CardItem {
        private String id;
        private String front;
        private String back;
        private boolean known;
    }
}