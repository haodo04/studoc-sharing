package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.PaymentTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends MongoRepository<PaymentTransaction, String> {
    // Hàm tìm kiếm hóa đơn theo mã tham chiếu giao dịch của VNPay gửi về
    Optional<PaymentTransaction> findByTxnRef(String txnRef);
}