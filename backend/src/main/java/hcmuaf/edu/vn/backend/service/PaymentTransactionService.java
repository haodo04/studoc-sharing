package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.PaymentTransaction;
import hcmuaf.edu.vn.backend.dto.PaymentTransactionDTO;
import hcmuaf.edu.vn.backend.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentTransactionService {

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    public List<PaymentTransactionDTO> getTransactionHistoryByClerkId(String clerkId) {
        List<PaymentTransaction> transactions = paymentTransactionRepository.findByClerkIdOrderByCreatedAtDesc(clerkId);

        if (transactions == null || transactions.isEmpty()) {
            return new ArrayList<>();
        }

        return transactions.stream().map(tx -> PaymentTransactionDTO.builder()
                .id(tx.getId())
                .txnRef(tx.getTxnRef())
                .clerkId(tx.getClerkId())
                .amount(tx.getAmount())
                .packageId(tx.getPackageId())
                .packageType(tx.getPackageType())
                .status(tx.getStatus())
                .vnpTransactionNo(tx.getVnpTransactionNo())
                .createdAt(tx.getCreatedAt())
                .build()
        ).collect(Collectors.toList());
    }
}
