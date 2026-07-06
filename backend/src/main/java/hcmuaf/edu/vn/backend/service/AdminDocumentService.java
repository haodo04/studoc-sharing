package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import hcmuaf.edu.vn.backend.document.ProfileDocument;
import hcmuaf.edu.vn.backend.dto.admin.AdminDocumentDTO;
import hcmuaf.edu.vn.backend.repository.FileMetadataRepository;
import hcmuaf.edu.vn.backend.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDocumentService {

    private final FileMetadataRepository fileMetadataRepository;
    private final ProfileRepository profileRepository;
    private final FileMetadataService fileMetadataService;

    public List<AdminDocumentDTO> getAllDocuments() {
        List<FileMetadataDocument> files = fileMetadataRepository.findAll();
        List<ProfileDocument> profiles = profileRepository.findAll();

        Map<String, ProfileDocument> profileMap = profiles.stream()
                .filter(p -> p.getClerkId() != null)
                .collect(Collectors.toMap(ProfileDocument::getClerkId, p -> p, (p1, p2) -> p1));

        return files.stream().map(file -> {
            ProfileDocument uploader = file.getClerkId() != null ? profileMap.get(file.getClerkId()) : null;
            
            String uploaderName = "Unknown";
            String uploaderEmail = "N/A";
            
            if (uploader != null) {
                uploaderName = uploader.getFirstName() + " " + uploader.getLastName();
                uploaderEmail = uploader.getEmail();
            }

            return AdminDocumentDTO.builder()
                    .id(file.getId())
                    .title(file.getTitle() != null ? file.getTitle() : file.getName())
                    .subjectName(file.getSubjectName())
                    .docType(file.getDocType())
                    .uploaderName(uploaderName)
                    .uploaderEmail(uploaderEmail)
                    .viewCount(file.getViewCount())
                    .downloadCount(file.getDownloadCount())
                    .isPublic(file.getIsPublic())
                    .uploadedAt(file.getUploadedAt())
                    .fileLocation(file.getFileLocation())
                    .type(file.getType())
                    .build();
        }).collect(Collectors.toList());
    }

    public void toggleDocumentVisibility(String id) {
        FileMetadataDocument document = fileMetadataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        document.setIsPublic(!Boolean.TRUE.equals(document.getIsPublic()));
        fileMetadataRepository.save(document);
    }

    public void deleteDocument(String id) throws IOException {
        fileMetadataService.deleteFile(id);
    }
}
