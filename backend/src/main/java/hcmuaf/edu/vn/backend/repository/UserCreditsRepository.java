package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.UserCredits;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserCreditsRepository extends MongoRepository<UserCredits, String> {
    boolean existsByClerkId(String clerkId);
    UserCredits findByClerkId(String clerkId);
    void deleteByClerkId(String clerkId);
}
