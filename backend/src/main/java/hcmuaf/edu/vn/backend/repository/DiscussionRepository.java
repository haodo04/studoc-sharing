package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.DiscussionDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DiscussionRepository extends MongoRepository<DiscussionDocument, String> {
    List<DiscussionDocument> findByFileIdOrderByCreatedAtAsc(String fileId);
    long countByParentId(String parentId);
}