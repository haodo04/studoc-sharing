package hcmuaf.edu.vn.backend.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "ai_concepts")
@AllArgsConstructor @NoArgsConstructor @Builder @Data
public class AiConceptsDocument {
    @Id
    private String id;
    @Indexed(unique = true)
    private String fileId;
    private List<ConceptItem> concepts;
    private LocalDateTime generatedAt;

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ConceptItem {
        private String term;
        private String explanation;
    }
}