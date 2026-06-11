package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.dto.DownloadHistoryDTO;
import hcmuaf.edu.vn.backend.dto.FileMetadataDTO;
import hcmuaf.edu.vn.backend.service.FileMetadataService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/files/interaction")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST})
public class FileInteractionController {

    private final FileMetadataService fileMetadataService;

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(
            @PathVariable String id,
            Principal principal
    ) throws IOException {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        String clerkId = principal.getName();

        FileMetadataDTO downloadableFile = fileMetadataService.processDownloadRequest(id, clerkId);

        Path path = Paths.get(downloadableFile.getFileLocation());
        Resource resource = new UrlResource(path.toUri());

        String contentType = Files.probeContentType(path);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        ContentDisposition contentDisposition = ContentDisposition.attachment()
                .filename(downloadableFile.getName(), StandardCharsets.UTF_8)
                .build();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                .body(resource);
    }

    @GetMapping("/history/{clerkId}")
    public ResponseEntity<List<DownloadHistoryDTO>> getDownloadHistory(
            @PathVariable String clerkId,
            Principal principal
    ) {
        if (principal == null || !principal.getName().equals(clerkId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<DownloadHistoryDTO> historyList = fileMetadataService.getDownloadHistoryByClerkId(clerkId);
        return ResponseEntity.ok(historyList);
    }
}