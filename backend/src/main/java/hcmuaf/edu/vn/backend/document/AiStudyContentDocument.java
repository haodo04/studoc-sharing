package hcmuaf.edu.vn.backend.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "ai_study_contents")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class AiStudyContentDocument {
    @Id
    private String id;
    @Indexed(unique = true)
    private String fileId;
    private String summary;
    private List<ConceptItem> concepts;
    private List<FlashcardItem> flashcards;
    private LocalDateTime generatedAt;
    private String modelUsed;

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ConceptItem {
        private String term;
        private String explanation;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class FlashcardItem {
        private String question;
        private String answer;
    }
}