package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.AiChatSessionDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface AiChatSessionRepository extends MongoRepository<AiChatSessionDocument, String> {
    List<AiChatSessionDocument> findByFileIdAndClerkIdOrderByUpdatedAtDesc(String fileId, String clerkId);
    Optional<AiChatSessionDocument> findByIdAndClerkId(String id, String clerkId);
}
