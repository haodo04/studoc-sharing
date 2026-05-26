package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.CategoryDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryRepository extends MongoRepository<CategoryDocument, String> {
}
