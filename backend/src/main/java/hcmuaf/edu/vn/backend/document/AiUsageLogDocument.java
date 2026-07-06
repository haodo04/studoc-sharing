package hcmuaf.edu.vn.backend.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "ai_usage_logs")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AiUsageLogDocument {
    @Id
    private String id;
    
    private String clerkId;
    private String documentId;
    
    // Loai hanh dong: "SUMMARY", "CONCEPTS", "FLASHCARD", "CHAT"
    private String actionType;
    
    // Mo ta them ve request neu co, vd: "Generating 10 cards"
    private String description;
    
    private LocalDateTime createdAt;
}
