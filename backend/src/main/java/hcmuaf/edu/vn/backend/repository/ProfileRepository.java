package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.ProfileDocument;
import org.springframework.data.mongodb.repository.MongoRepository; // Hoặc JpaRepository tùy dự án của bạn

public interface ProfileRepository extends MongoRepository<ProfileDocument, String> {
    ProfileDocument findByClerkId(String clerkId);

    boolean existsByClerkId(String clerkId);
}