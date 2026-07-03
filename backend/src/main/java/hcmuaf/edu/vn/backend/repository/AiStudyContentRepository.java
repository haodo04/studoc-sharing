package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.AiStudyContentDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AiStudyContentRepository extends MongoRepository<AiStudyContentDocument, String> {
    Optional<AiStudyContentDocument> findByFileId(String fileId);
}

