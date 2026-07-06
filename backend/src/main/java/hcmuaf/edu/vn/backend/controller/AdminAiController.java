package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.document.AiUsageLogDocument;
import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import hcmuaf.edu.vn.backend.document.ProfileDocument;
import hcmuaf.edu.vn.backend.dto.admin.AdminAiLogDTO;
import hcmuaf.edu.vn.backend.repository.FileMetadataRepository;
import hcmuaf.edu.vn.backend.repository.ProfileRepository;
import hcmuaf.edu.vn.backend.service.AiTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/ai")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminAiController {

    private final AiTrackingService aiTrackingService;
    private final ProfileRepository profileRepository;
    private final FileMetadataRepository fileMetadataRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(aiTrackingService.getAiStats());
    }

    @GetMapping("/logs")
    public ResponseEntity<List<AdminAiLogDTO>> getLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
            
        Page<AiUsageLogDocument> logsPage = aiTrackingService.getRecentLogs(page, size);
        
        List<AdminAiLogDTO> dtos = logsPage.stream().map(log -> {
            String userEmail = "Unknown";
            String userFullName = "Unknown";
            if (log.getClerkId() != null) {
                var profile = profileRepository.findByClerkId(log.getClerkId());
                if (profile != null) {
                    userEmail = profile.getEmail();
                    userFullName = profile.getFirstName() + " " + profile.getLastName();
                }
            }
            
            String documentTitle = "Unknown Document";
            if (log.getDocumentId() != null) {
                var fileOpt = fileMetadataRepository.findById(log.getDocumentId());
                if (fileOpt.isPresent()) {
                    documentTitle = fileOpt.get().getTitle();
                }
            }
            
            return AdminAiLogDTO.builder()
                    .id(log.getId())
                    .clerkId(log.getClerkId())
                    .userEmail(userEmail)
                    .userFullName(userFullName.trim())
                    .documentId(log.getDocumentId())
                    .documentTitle(documentTitle)
                    .actionType(log.getActionType())
                    .description(log.getDescription())
                    .createdAt(log.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }
}
