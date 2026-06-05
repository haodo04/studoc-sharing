package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends MongoRepository<FileMetadataDocument, String> {

}
