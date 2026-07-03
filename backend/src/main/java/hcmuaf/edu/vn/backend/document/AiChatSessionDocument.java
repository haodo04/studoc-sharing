package hcmuaf.edu.vn.backend.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "ai_chat_sessions")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class AiChatSessionDocument {
    @Id
    private String id;
    private String fileId;
    private String clerkId;
    private List<ChatTurn> messages;
    private LocalDateTime updatedAt;

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ChatTurn {
        private String role;
        private String content;
        private LocalDateTime timestamp;
    }
}