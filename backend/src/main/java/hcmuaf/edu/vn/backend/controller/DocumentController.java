package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.dto.response.DocumentResponseDTO;
import hcmuaf.edu.vn.backend.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1.0/documents") // Bạn có thể chỉnh lại tiền tố API cho hợp chuẩn dự án
@CrossOrigin(origins = "*") // Cho phép Frontend gọi API (hoặc cấu hình ở WebConfig)
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    /**
     * API Tìm kiếm và Lọc tài liệu đa điều kiện
     * Ví dụ: GET /api/v1.0/documents/search?keyword=Giải%20tích&categoryId=IT&page=0&size=12
     */
    @GetMapping("/search")
    public ResponseEntity<Page<DocumentResponseDTO>> searchDocuments(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String explore,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String universityId,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "0") int page,       // Mặc định trang đầu tiên (index = 0)
            @RequestParam(defaultValue = "12") int size       // Mặc định lấy 12 tài liệu mỗi trang
    ) {

        Page<DocumentResponseDTO> result = documentService.searchAndFilterDocuments(
                keyword, explore, categoryId, universityId, sortBy, page, size
        );

        return ResponseEntity.ok(result);
    }
}