package hcmuaf.edu.vn.backend.controller;
import hcmuaf.edu.vn.backend.dto.PaymentTransactionDTO;
import hcmuaf.edu.vn.backend.service.PaymentTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET})
public class PaymentTransactionController {

    private final PaymentTransactionService paymentTransactionService;

    @GetMapping("/history/{clerkId}")
    public ResponseEntity<List<PaymentTransactionDTO>> getTransactionHistory(
            @PathVariable String clerkId,
            Principal principal
    ) {
        if (principal == null || !principal.getName().equals(clerkId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<PaymentTransactionDTO> history = paymentTransactionService.getTransactionHistoryByClerkId(clerkId);
        return ResponseEntity.ok(history);
    }
}
