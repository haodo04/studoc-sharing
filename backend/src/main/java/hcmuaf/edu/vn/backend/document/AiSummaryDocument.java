package hcmuaf.edu.vn.backend.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "ai_summaries")
@CompoundIndex(name = "file_lang_unique", def = "{'fileId': 1, 'language': 1}", unique = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class AiSummaryDocument {
    @Id
    private String id;
    private String fileId;
    private String language;
    private String content;
    private LocalDateTime generatedAt;
}