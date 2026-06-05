package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.dto.response.DocumentResponseDTO;
import org.springframework.data.domain.Page;

public interface DocumentService {
    Page<DocumentResponseDTO> searchAndFilterDocuments(
            String keyword, String explore, String categoryId,
            String universityId, String sortBy, int page, int size
    );
}