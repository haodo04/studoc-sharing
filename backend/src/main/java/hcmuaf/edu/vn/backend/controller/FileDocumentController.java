package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.dto.FileMetadataDTO;
import hcmuaf.edu.vn.backend.dto.response.FileDetailResponseDTO;
import hcmuaf.edu.vn.backend.service.FileMetadataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET})
public class FileDocumentController {

    private final FileMetadataService fileMetadataService;

    @GetMapping
    public ResponseEntity<List<FileMetadataDTO>> getAllFiles() {
        return ResponseEntity.ok(fileMetadataService.getFiles());
    }

    @GetMapping("/public")
    public ResponseEntity<List<FileMetadataDTO>> getPublicFiles() {
        List<FileMetadataDTO> publicFiles = fileMetadataService.getPublicFiles();
        return ResponseEntity.ok(publicFiles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FileDetailResponseDTO> getDocumentDetails(@PathVariable String id) {
        FileDetailResponseDTO file = fileMetadataService.getFileById(id);
        return ResponseEntity.ok(file);
    }

    @GetMapping("/{id}/related")
    public ResponseEntity<List<FileMetadataDTO>> getRelatedDocuments(
            @PathVariable String id,
            @RequestParam(defaultValue = "4") int limit) {
        List<FileMetadataDTO> relatedFiles = fileMetadataService.getRelatedDocuments(id, limit);
        return ResponseEntity.ok(relatedFiles);
    }
}