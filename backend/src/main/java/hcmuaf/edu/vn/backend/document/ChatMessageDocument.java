package hcmuaf.edu.vn.backend.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "community_messages")
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class ChatMessageDocument {
    @Id
    private String id;
    private String roomId;        // "general" | "category:{id}" | "university:{id}"
    private String type;
    private String content;
    private String sharedFileId;
    private String senderClerkId;
    private String senderFullName;
    private String senderPhotoUrl;
    private LocalDateTime createdAt;
}