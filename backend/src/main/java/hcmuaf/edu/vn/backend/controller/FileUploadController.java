package hcmuaf.edu.vn.backend.controller;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import hcmuaf.edu.vn.backend.dto.FileMetadataDTO;
import hcmuaf.edu.vn.backend.service.FileMetadataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files/manage")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PATCH})
public class FileUploadController {

    private final FileMetadataService fileMetadataService;

    @PostMapping("/upload")
    public ResponseEntity<List<FileMetadataDTO>> uploadFile(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("metadata") String metadataJson
    ) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        FileMetadataDTO dto = objectMapper.readValue(metadataJson, FileMetadataDTO.class);
        List<FileMetadataDTO> result = fileMetadataService.upLoadFiles(files, dto);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable String id) {
        fileMetadataService.deleteFile(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-public")
    public ResponseEntity<FileMetadataDTO> togglePublic(@PathVariable String id) {
        FileMetadataDTO file = fileMetadataService.togglePublic(id);
        return ResponseEntity.ok(file);
    }

    @GetMapping("/user/{clerkId}")
    public ResponseEntity<List<FileMetadataDTO>> getFilesByUser(@PathVariable String clerkId) {
        List<FileMetadataDTO> result = fileMetadataService.getFilesByClerkId(clerkId);
        return ResponseEntity.ok(result);
    }
}