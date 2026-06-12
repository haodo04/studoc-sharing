package hcmuaf.edu.vn.backend.controller;

import com.cloudinary.Cloudinary;
import hcmuaf.edu.vn.backend.dto.DownloadHistoryDTO;
import hcmuaf.edu.vn.backend.dto.FileMetadataDTO;
import hcmuaf.edu.vn.backend.service.FileMetadataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/files/interaction")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST})
public class FileInteractionController {

    private final FileMetadataService fileMetadataService;
    private final Cloudinary cloudinary;

    @GetMapping("/{id}/download")
    public ResponseEntity<?> download(@PathVariable String id, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        FileMetadataDTO file = fileMetadataService.processDownloadRequest(id, principal.getName());

        Map<String, String> response = new java.util.HashMap<>();
        response.put("downloadUrl", file.getFileLocation());
        response.put("fileName", file.getName());
        return ResponseEntity.ok(response);
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