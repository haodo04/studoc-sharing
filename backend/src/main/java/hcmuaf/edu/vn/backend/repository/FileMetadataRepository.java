package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FileMetadataRepository extends MongoRepository<FileMetadataDocument, String>, FileMetadataRepositoryCustom {

    List<FileMetadataDocument> findByClerkId(String clerkId);

    long countByClerkId(String clerkId);

    //    Lọc theo trường học
    List<FileMetadataDocument> findByIsPublicTrueAndUniversityId(String universityId);

    //    Lọc theo ngành học
    List<FileMetadataDocument> findByIsPublicTrueAndCategoryId(String categoryId);

    //    Lọc theo từ khóa tìm kiếm
    List<FileMetadataDocument> findByIsPublicTrueAndTitleRegexIgnoreCase(String keyword);

    // lấy tất ca file đang public
    List<FileMetadataDocument> findByIsPublicTrue();

    List<FileMetadataDocument> findByCategoryIdAndIsPublicTrueAndIdNot(String categoryId, String id, Pageable pageable);
}