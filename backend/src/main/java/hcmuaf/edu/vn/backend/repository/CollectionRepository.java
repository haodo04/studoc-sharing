package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.CollectionDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface CollectionRepository extends MongoRepository<CollectionDocument, String> {
    List<CollectionDocument> findByClerkIdOrderByUpdatedAtDesc(String clerkId);
    Optional<CollectionDocument> findByIdAndClerkId(String id, String clerkId);
}