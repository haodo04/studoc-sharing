package hcmuaf.edu.vn.backend.service.iml;

import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import hcmuaf.edu.vn.backend.dto.response.DocumentResponseDTO;
import hcmuaf.edu.vn.backend.repository.FileMetadataRepository;
import hcmuaf.edu.vn.backend.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private FileMetadataRepository fileMetadataRepository;

    @Override
    public Page<DocumentResponseDTO> searchAndFilterDocuments(
            String keyword, String explore, String categoryId,
            String universityId, String sortBy, int page, int size) {

        // 1. Tạo đối tượng Phân trang (Pageable)
        Pageable pageable = PageRequest.of(page, size);

        // 2. Gọi hàm Custom Repository cực mạnh của chúng ta
        Page<FileMetadataDocument> documentPage = fileMetadataRepository
                .searchAndFilterDocuments(keyword, explore, categoryId, universityId, sortBy, pageable);

        // 3. Map (chuyển đổi) từng Entity thành DTO
        return documentPage.map(this::mapToDTO);
    }

    // Hàm phụ trợ chuyển đổi Entity -> DTO
    private DocumentResponseDTO mapToDTO(FileMetadataDocument doc) {
        return DocumentResponseDTO.builder()
                .id(doc.getId())
                .title(doc.getTitle())
                .description(doc.getDescription())
                .docType(doc.getDocType() != null ? doc.getDocType() : doc.getType()) // Ưu tiên docType
                .categoryId(doc.getCategoryId())

                // Xử lý logic nếu trường đại học là OTHER thì lấy trường custom
                .universityCode(
                        "OTHER".equals(doc.getUniversityId())
                                ? doc.getCustomUniversity()
                                : doc.getUniversityId()
                )

                .subjectCode(doc.getSubjectCode())
                .creditCost(doc.getCreditCost() != null ? doc.getCreditCost() : 0) // Fix lỗi Null Pointer
                .rating(doc.getRating())
                .downloadCount(doc.getDownloadCount())
                .thumbnailUrl(doc.getThumbnailUrl())
                .build();
    }
}
