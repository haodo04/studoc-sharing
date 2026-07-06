package hcmuaf.edu.vn.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminReportDTO {
    private String id;
    private String documentId;
    private String documentTitle;
    private String reporterName;
    private String reporterEmail;
    private String reason;
    private String detail;
    private String status;
    private Instant createdAt;
}
