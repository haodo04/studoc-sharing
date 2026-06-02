package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.UserCredits;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserCreditsRepository extends MongoRepository<UserCredits, String> {
    boolean existsByClerkId(String clerkId);
    Optional<UserCredits> findByClerkId(String clerkId);
    void deleteByClerkId(String clerkId);
}
