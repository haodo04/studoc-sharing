package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.PaymentTransaction;
import hcmuaf.edu.vn.backend.document.UserCredits;
import hcmuaf.edu.vn.backend.dto.request.PaymentRequest;
import hcmuaf.edu.vn.backend.repository.PaymentTransactionRepository;
import hcmuaf.edu.vn.backend.config.Config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class VnPayService {

    @Autowired
    private PaymentTransactionRepository transactionRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Transactional
    public String createPaymentUrl(PaymentRequest paymentRequest, String clerkId, String ipAddress) {
        String vnp_TxnRef = Config.getRandomNumber(8);
        long amountInVnd = paymentRequest.getAmount() * 100;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", Config.vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amountInVnd));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan goi " + paymentRequest.getPackageId() + " cho User " + clerkId);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", paymentRequest.getReturnUrl() != null ? paymentRequest.getReturnUrl() : Config.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", ipAddress);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        vnp_Params.put("vnp_CreateDate", formatter.format(cld.getTime()));

        cld.add(Calendar.MINUTE, 15);
        vnp_Params.put("vnp_ExpireDate", formatter.format(cld.getTime()));

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (Iterator<String> it = fieldNames.iterator(); it.hasNext(); ) {
            String fieldName = it.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName).append("=").append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII)).append("=").append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (it.hasNext()) {
                    hashData.append("&");
                    query.append("&");
                }
            }
        }

        String vnp_SecureHash = Config.hmacSHA512(Config.secretKey, hashData.toString());
        String paymentUrl = Config.vnp_PayUrl + "?" + query + "&vnp_SecureHash=" + vnp_SecureHash;

        String packageType = paymentRequest.getPackageId().startsWith("coin") ? "COIN" : "PREMIUM";
        PaymentTransaction transaction = PaymentTransaction.builder()
                .txnRef(vnp_TxnRef)
                .clerkId(clerkId)
                .amount(paymentRequest.getAmount())
                .packageId(paymentRequest.getPackageId())
                .packageType(packageType)
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        transactionRepository.save(transaction);

        return paymentUrl;
    }

    @Transactional
    public String processVnPayReturn(Map<String, String> vnpParams) {
        String txnRef = vnpParams.get("vnp_TxnRef");
        String responseCode = vnpParams.get("vnp_ResponseCode");
        String vnpTransactionNo = vnpParams.get("vnp_TransactionNo");

        PaymentTransaction tx = transactionRepository.findByTxnRef(txnRef)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin giao dịch tương ứng."));

        if ("SUCCESS".equals(tx.getStatus())) {
            return "Giao dịch này đã được cập nhật thành công trước đó.";
        }

        if ("00".equals(responseCode)) {
            tx.setStatus("SUCCESS");
            tx.setVnpTransactionNo(vnpTransactionNo);
            tx.setUpdatedAt(LocalDateTime.now());
            transactionRepository.save(tx);

            Query queryUser = new Query(Criteria.where("clerkId").is(tx.getClerkId()));
            Update update = new Update();

            if ("COIN".equals(tx.getPackageType())) {
                int bonusCoins = switch (tx.getPackageId()) {
                    case "coin-1" -> 5;
                    case "coin-2" -> 15 + 3;
                    case "coin-3" -> 50 + 20;
                    default -> 0;
                };

                update.inc("credits", bonusCoins);
            } else if ("PREMIUM".equals(tx.getPackageType())) {
                boolean isYearly = "sub-year".equals(tx.getPackageId());
                String planName = isYearly ? hcmuaf.edu.vn.backend.service.UserCreditsService.PLAN_PREMIUM_YEAR
                        : hcmuaf.edu.vn.backend.service.UserCreditsService.PLAN_PREMIUM_MONTH;

                LocalDateTime expiresAt = isYearly
                        ? LocalDateTime.now().plusYears(1)
                        : LocalDateTime.now().plusMonths(1);

                update.set("plan", planName);
                update.set("planExpiresAt", expiresAt);
            }

            mongoTemplate.updateFirst(queryUser, update, UserCredits.class);
            return "Thanh toán và đồng bộ tài khoản thành công!";
        } else {
            tx.setStatus("FAILED");
            tx.setUpdatedAt(LocalDateTime.now());
            transactionRepository.save(tx);
            throw new RuntimeException("Thanh toán thất bại hoặc người dùng đã hủy giao dịch.");
        }
    }
}