package hcmuaf.edu.vn.backend.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "assistant_chat_sessions")
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class AssistantChatSessionDocument {
    @Id
    private String id;
    private String ownerKey;
    private String title;
    private List<Turn> messages;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data @Builder @AllArgsConstructor @NoArgsConstructor
    public static class Turn {
        private String role;
        private String content;
        private List<DocumentCardSnapshot> documents;
    }

    @Data @Builder @AllArgsConstructor @NoArgsConstructor
    public static class DocumentCardSnapshot {
        private String id;
        private String title;
        private String thumbnailUrl;
        private Integer creditCost;
        private String subjectName;
    }
}