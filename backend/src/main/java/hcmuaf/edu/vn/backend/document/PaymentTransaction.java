package hcmuaf.edu.vn.backend.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "payment_transactions")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentTransaction {
    @Id
    private String id;
    private String txnRef;
    private String clerkId;
    private Long amount;
    private String packageId;
    private String packageType;
    private String status;
    private String vnpTransactionNo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
