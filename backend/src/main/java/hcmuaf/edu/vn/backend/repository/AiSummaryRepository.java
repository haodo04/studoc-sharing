package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.AiSummaryDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AiSummaryRepository extends MongoRepository<AiSummaryDocument, String> {
    Optional<AiSummaryDocument> findByFileIdAndLanguage(String fileId, String language);
}

