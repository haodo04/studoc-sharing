package hcmuaf.edu.vn.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentTransactionDTO {
    private String id;
    private String txnRef;
    private String clerkId;
    private Long amount;
    private String packageId;
    private String packageType;
    private String status;
    private String vnpTransactionNo;
    private LocalDateTime createdAt;
}
