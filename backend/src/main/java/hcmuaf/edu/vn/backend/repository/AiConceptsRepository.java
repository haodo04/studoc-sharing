package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.AiConceptsDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AiConceptsRepository extends MongoRepository<AiConceptsDocument, String> {
    Optional<AiConceptsDocument> findByFileId(String fileId);
}