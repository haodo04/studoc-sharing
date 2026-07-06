package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.PaymentTransaction;
import hcmuaf.edu.vn.backend.document.ProfileDocument;
import hcmuaf.edu.vn.backend.dto.admin.AdminTransactionDTO;
import hcmuaf.edu.vn.backend.repository.PaymentTransactionRepository;
import hcmuaf.edu.vn.backend.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminTransactionService {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final ProfileRepository profileRepository;

    public List<AdminTransactionDTO> getAllTransactions() {
        List<PaymentTransaction> transactions = paymentTransactionRepository.findAll();
        List<ProfileDocument> profiles = profileRepository.findAll();

        Map<String, ProfileDocument> profileMap = profiles.stream()
                .collect(Collectors.toMap(ProfileDocument::getClerkId, p -> p, (p1, p2) -> p1));

        return transactions.stream()
                .map(txn -> {
                    ProfileDocument profile = profileMap.get(txn.getClerkId());
                    String fullName = profile != null ? (profile.getFirstName() + " " + profile.getLastName()).trim() : "Unknown User";
                    String email = profile != null ? profile.getEmail() : "No Email";

                    return AdminTransactionDTO.builder()
                            .id(txn.getId())
                            .txnRef(txn.getTxnRef())
                            .clerkId(txn.getClerkId())
                            .userFullName(fullName)
                            .userEmail(email)
                            .amount(txn.getAmount())
                            .packageType(txn.getPackageType())
                            .status(txn.getStatus())
                            .vnpTransactionNo(txn.getVnpTransactionNo())
                            .createdAt(txn.getCreatedAt())
                            .build();
                })
                .sorted(Comparator.comparing(AdminTransactionDTO::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
    }
}
