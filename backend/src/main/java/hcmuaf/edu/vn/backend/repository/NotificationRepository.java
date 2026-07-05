package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.NotificationDocument;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<NotificationDocument, String> {
    List<NotificationDocument> findByRecipientClerkIdOrderByCreatedAtDesc(String recipientClerkId, Pageable pageable);
    long countByRecipientClerkIdAndIsReadFalse(String recipientClerkId);
    List<NotificationDocument> findByRecipientClerkIdAndIsReadFalse(String recipientClerkId);
}