package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.dto.CategoryDTO;
import hcmuaf.edu.vn.backend.dto.UniversityDTO;
import hcmuaf.edu.vn.backend.service.CategoryService;
import hcmuaf.edu.vn.backend.service.UniversityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/metadata")
public class SystemMetadataController {

    private final UniversityService universityService;
    private final CategoryService categoryService;

    @GetMapping("/universities")
    public ResponseEntity<List<UniversityDTO>> getAllUniversities() {
        return ResponseEntity.ok(universityService.getAllUniversities());
    }


    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
}