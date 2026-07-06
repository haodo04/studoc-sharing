package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.SystemSettingDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemSettingRepository extends MongoRepository<SystemSettingDocument, String> {
}
