package hcmuaf.edu.vn.backend.dto.request;

import lombok.Data;

@Data
public class PaymentRequest {
    private String packageId;
    private Long amount;
    private String returnUrl;
}
