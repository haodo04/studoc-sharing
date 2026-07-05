package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.ChatMessageDocument;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessageDocument, String> {
    List<ChatMessageDocument> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<ChatMessageDocument> findByRoomIdOrderByCreatedAtDesc(String roomId, Pageable pageable);
}