package hcmuaf.edu.vn.backend.dto.admin;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AdminAiLogDTO {
    private String id;
    private String clerkId;
    private String userEmail;
    private String userFullName;
    private String documentId;
    private String documentTitle;
    private String actionType;
    private String description;
    private LocalDateTime createdAt;
}
