package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FileMetadataRepository extends MongoRepository<FileMetadataDocument, String> {
    List<FileMetadataDocument> findByClerkId(String clerkId);

    long countByClerkId(String clerkId);

}
