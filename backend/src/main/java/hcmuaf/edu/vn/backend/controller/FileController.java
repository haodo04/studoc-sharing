package hcmuaf.edu.vn.backend.controller;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import hcmuaf.edu.vn.backend.dto.FileMetadataDTO;
import hcmuaf.edu.vn.backend.service.FileMetadataService;
import hcmuaf.edu.vn.backend.service.UserCreditsService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS})
public class FileController {

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

    @GetMapping
    public ResponseEntity<List<FileMetadataDTO>> getAllFiles() {
        return ResponseEntity.ok(fileMetadataService.getFiles());
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable String id) throws IOException {
        FileMetadataDTO downloadableFile = fileMetadataService.processDownloadRequest(id);

        Path path = Paths.get(downloadableFile.getFileLocation());
        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downloadableFile.getName() + "\"")
                .body(resource);
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

    @GetMapping("/public")
    public ResponseEntity<List<FileMetadataDTO>> getPublicFiles() {
        List<FileMetadataDTO> publicFiles = fileMetadataService.getPublicFiles();
        return ResponseEntity.ok(publicFiles);
    }
}