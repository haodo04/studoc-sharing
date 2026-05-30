package hcmuaf.edu.vn.backend.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "favorites")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteDocument {
    @Id
    private String id;
    @Indexed
    private String clerkId;       // Ai lưu
    private String fileId;        // Lưu file nào
    private LocalDateTime savedAt;
}
