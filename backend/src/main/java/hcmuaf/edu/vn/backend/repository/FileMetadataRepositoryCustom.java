package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FileMetadataRepositoryCustom {
    // Các tham số có thể null nếu người dùng không chọn bộ lọc đó
    Page<FileMetadataDocument> searchAndFilterDocuments(
            String keyword,
            String explore,
            String categoryId,
            String universityId,
            String sortBy,
            Pageable pageable
    );
}