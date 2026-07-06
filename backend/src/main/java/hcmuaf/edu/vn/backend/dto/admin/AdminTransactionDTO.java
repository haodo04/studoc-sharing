package hcmuaf.edu.vn.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminTransactionDTO {
    private String id;
    private String txnRef;
    private String clerkId;
    private String userFullName;
    private String userEmail;
    private Long amount;
    private String packageType;
    private String status;
    private String vnpTransactionNo;
    private LocalDateTime createdAt;
}
