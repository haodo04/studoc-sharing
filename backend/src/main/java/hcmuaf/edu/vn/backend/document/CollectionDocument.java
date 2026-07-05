package hcmuaf.edu.vn.backend.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "collections")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class CollectionDocument {
    @Id
    private String id;
    private String clerkId;
    private String name;

    @Builder.Default
    private List<String> fileIds = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}