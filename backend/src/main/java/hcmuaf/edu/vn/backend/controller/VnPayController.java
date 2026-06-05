package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.dto.request.PaymentRequest;
import hcmuaf.edu.vn.backend.service.VnPayService;
import hcmuaf.edu.vn.backend.config.Config;
import hcmuaf.edu.vn.backend.util.VnPayUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class VnPayController {

    @Autowired
    private VnPayService vnPayService;

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createPayment(
            @RequestBody PaymentRequest paymentRequest,
            HttpServletRequest request) {

        String clerkId = (String) request.getAttribute("clerkId");
        if (clerkId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Người dùng chưa đăng nhập hệ thống"));
        }

        String ipAddress = Config.getIpAddress(request);

        String paymentUrl = vnPayService.createPaymentUrl(paymentRequest, clerkId, ipAddress);

        Map<String, String> response = new HashMap<>();
        response.put("paymentUrl", paymentUrl);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/vnpay_return")
    public ResponseEntity<?> handleVnPayReturn(HttpServletRequest request) {
        Map<String, String> vnpParams = VnPayUtils.getVnPayResponseParams(request);

        try {
            String resultMessage = vnPayService.processVnPayReturn(vnpParams);
            return ResponseEntity.ok(resultMessage);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}