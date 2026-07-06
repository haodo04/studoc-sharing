package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.dto.response.DocumentResponseDTO;
import hcmuaf.edu.vn.backend.dto.CategoryDTO;
import hcmuaf.edu.vn.backend.dto.UniversityDTO;
import hcmuaf.edu.vn.backend.dto.document.ReportRequestDTO;
import hcmuaf.edu.vn.backend.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.security.Principal;

@RestController
@RequestMapping("/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @GetMapping("/search")
    public ResponseEntity<Page<DocumentResponseDTO>> searchDocuments(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String explore,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String universityId,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Page<DocumentResponseDTO> result = documentService.searchAndFilterDocuments(
                keyword, explore, categoryId, universityId, sortBy, page, size
        );
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{documentId}/report")
    public ResponseEntity<Void> createReport(@PathVariable String documentId, @RequestBody ReportRequestDTO request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        String clerkId = principal.getName();
        documentService.createReport(documentId, clerkId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        List<CategoryDTO> categories = documentService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/universities")
    public ResponseEntity<List<UniversityDTO>> getAllUniversities() {
        List<UniversityDTO> universities = documentService.getAllUniversities();
        return ResponseEntity.ok(universities);
    }
}