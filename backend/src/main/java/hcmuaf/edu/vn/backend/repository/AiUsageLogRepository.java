package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.AiUsageLogDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AiUsageLogRepository extends MongoRepository<AiUsageLogDocument, String> {
    List<AiUsageLogDocument> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    long countByActionType(String actionType);
}
