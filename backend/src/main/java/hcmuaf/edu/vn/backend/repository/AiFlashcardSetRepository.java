package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.AiFlashcardSetDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface AiFlashcardSetRepository extends MongoRepository<AiFlashcardSetDocument, String> {
    List<AiFlashcardSetDocument> findByFileIdAndClerkIdOrderByCreatedAtDesc(String fileId, String clerkId);
    Optional<AiFlashcardSetDocument> findByIdAndClerkId(String id, String clerkId);
}