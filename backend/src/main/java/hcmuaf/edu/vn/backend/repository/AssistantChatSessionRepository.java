package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.AssistantChatSessionDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AssistantChatSessionRepository extends MongoRepository<AssistantChatSessionDocument, String> {
    List<AssistantChatSessionDocument> findByOwnerKeyOrderByUpdatedAtDesc(String ownerKey);
}