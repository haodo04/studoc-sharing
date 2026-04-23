package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.UserCredits;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserCreditsRepository extends MongoRepository<UserCredits, String> {

}
