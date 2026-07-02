package hcmuaf.edu.vn.backend.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "unlock_history")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UnlockHistoryDocument {
    @Id
    private String id;
    private String clerkId;
    private String fileId;
    private int creditSpent;
    private LocalDateTime unlockedAt;
}