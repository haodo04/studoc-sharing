package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.UniversityDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UniversityRepository extends MongoRepository<UniversityDocument, String> {
}
