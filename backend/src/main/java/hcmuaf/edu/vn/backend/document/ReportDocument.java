package hcmuaf.edu.vn.backend.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "reports")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportDocument {
    @Id
    private String id;
    private String documentId;
    private String reporterClerkId;
    private String reporterName;
    private String reporterEmail;
    private String reason;
    private String detail;
    private String status; // PENDING, RESOLVED, REJECTED
    
    @CreatedDate
    private Instant createdAt;
}
