package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.UnlockHistoryDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UnlockHistoryRepository extends MongoRepository<UnlockHistoryDocument, String> {
    Optional<UnlockHistoryDocument> findByClerkIdAndFileId(String clerkId, String fileId);
    boolean existsByClerkIdAndFileId(String clerkId, String fileId);
}