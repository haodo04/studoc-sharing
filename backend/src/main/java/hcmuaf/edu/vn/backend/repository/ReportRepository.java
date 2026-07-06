package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.ReportDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends MongoRepository<ReportDocument, String> {
    List<ReportDocument> findByDocumentId(String documentId);
}
