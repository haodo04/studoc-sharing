package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.AiChatSessionDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AiChatSessionRepository extends MongoRepository<AiChatSessionDocument, String> {
    Optional<AiChatSessionDocument> findByFileIdAndClerkId(String fileId, String clerkId);
}
