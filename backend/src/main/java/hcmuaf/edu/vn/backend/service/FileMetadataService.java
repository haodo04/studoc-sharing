package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import hcmuaf.edu.vn.backend.document.ProfileDocument;
import hcmuaf.edu.vn.backend.dto.FileMetadataDTO;
import hcmuaf.edu.vn.backend.dto.response.FileDetailResponseDTO;
import hcmuaf.edu.vn.backend.repository.FileMetadataRepository;
import hcmuaf.edu.vn.backend.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileMetadataService {

    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;
    private final FileMetadataRepository fileMetadataRepository;
    private final ProfileRepository profileRepository;

    public List<FileMetadataDTO> upLoadFiles(MultipartFile files[]) throws IOException {
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        List<FileMetadataDocument> savedFiles = new ArrayList<>();

        if (!userCreditsService.hasEnoughCredits(files.length)) {
            throw new RuntimeException("Not enough credits to upload files. Please purchase more credits");
        }

        Path uploadPath = Paths.get("upload").toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        for (MultipartFile file : files) {
            String fileName = UUID.randomUUID() + "." + StringUtils.getFilenameExtension(file.getOriginalFilename());
            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            FileMetadataDocument fileMetadata = FileMetadataDocument.builder()
                    .fileLocation(targetLocation.toString())
                    .name(file.getOriginalFilename())
                    .size(file.getSize())
                    .type(file.getContentType())
                    .clerkId(currentProfile.getClerkId())
                    .isPublic(false)
                    .uploadedAt(LocalDateTime.now())
                    .build();

            userCreditsService.consumeCredits();

            savedFiles.add(fileMetadataRepository.save(fileMetadata));
        }

        return savedFiles.stream().map(fileMetadataDocument -> mapToDTO(fileMetadataDocument))
                .collect(Collectors.toList());
    }

    public List<FileMetadataDTO> getFiles() {
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        List<FileMetadataDocument> files = fileMetadataRepository.findByClerkId(currentProfile.getClerkId());
        return files.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public FileMetadataDTO getPublicFile(String id) {
        Optional<FileMetadataDocument> fileOptional = fileMetadataRepository.findById(id);
        if (fileOptional.isEmpty() || !fileOptional.get().getIsPublic()) {
            throw new RuntimeException("Unable to get the file ");
        }

        FileMetadataDocument document = fileOptional.get();
        return mapToDTO(document);
    }

    public FileMetadataDTO getDownloadableFile(String id) {
        FileMetadataDocument file = fileMetadataRepository.findById(id).orElseThrow(() -> new RuntimeException("File no found"));
        return mapToDTO(file);
    }

    public void deleteFile(String id) {
        try {
            ProfileDocument currentProfile = profileService.getCurrentProfile();
            FileMetadataDocument file = fileMetadataRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("File no found"));
            if (!file.getClerkId().equals(currentProfile.getClerkId())) {
                throw new RuntimeException("File is not belong to current user");
            }

            Path filePath = Paths.get(file.getFileLocation());
            Files.deleteIfExists(filePath);

            fileMetadataRepository.deleteById(id);
        }catch (Exception e) {
            throw new RuntimeException("Error deleting the file");
        }
    }

    public FileMetadataDTO togglePublic(String id) {
        FileMetadataDocument file = fileMetadataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File no found"));

        file.setIsPublic(!file.getIsPublic());
        fileMetadataRepository.save(file);
        return mapToDTO(file);
    }

    /**
     * 1. Lấy danh sách file công khai phục vụ trang Explore (Có bộ lọc động)
     */
    public List<FileMetadataDTO> getExploreFiles(String universityId, String categoryId, String search) {
        List<hcmuaf.edu.vn.backend.document.FileMetadataDocument> documents;

        if (search != null && !search.trim().isEmpty()) {
            documents = fileMetadataRepository.findByIsPublicTrueAndTitleRegexIgnoreCase(search);
        } else if (universityId != null && !universityId.trim().isEmpty()) {
            documents = fileMetadataRepository.findByIsPublicTrueAndUniversityId(universityId);
        } else if (categoryId != null && !categoryId.trim().isEmpty()) {
            documents = fileMetadataRepository.findByIsPublicTrueAndCategoryId(categoryId);
        } else {
            documents = fileMetadataRepository.findAll().stream()
                    .filter(d -> Boolean.TRUE.equals(d.getIsPublic()))
                    .collect(Collectors.toList());
        }

        return documents.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    /**
     * 2. Lấy chi tiết tài liệu và gộp thông tin Tác giả (Trang chi tiết)
     */
    public FileDetailResponseDTO getFileDetail(String id) {
        FileMetadataDocument fileDoc = fileMetadataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tài liệu không tồn tại"));

        // Tăng viewCount trực tiếp khi có người nhấn xem chi tiết
        fileDoc.setViewCount(fileDoc.getViewCount() + 1);
        fileMetadataRepository.save(fileDoc);

        // Tìm profile của người đăng file (tác giả)
        ProfileDocument authorDoc = profileRepository.findByClerkId(fileDoc.getClerkId());
        String authorName = "Thành viên StudocShare";
        String authorAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100";

        if (authorDoc != null) {
            authorName = authorDoc.getLastName() + " " + authorDoc.getFirstName();
            if (authorDoc.getPhotoUrl() != null) {
                authorAvatar = authorDoc.getPhotoUrl();
            }
        }

        // Map sang FileDetailResponseDTO
        return FileDetailResponseDTO.builder()
                .id(fileDoc.getId())
                .title(fileDoc.getTitle() != null ? fileDoc.getTitle() : fileDoc.getName())
                .type(fileDoc.getType())
                .size(fileDoc.getSize())
                .fileLocation(fileDoc.getFileLocation())
                .uploadedAt(fileDoc.getUploadedAt())
                .universityId(fileDoc.getUniversityId())
                .subjectCode(fileDoc.getSubjectCode())
                .subjectName(fileDoc.getSubjectName())
                .docType(fileDoc.getDocType())
                .description(fileDoc.getDescription())
                .pageCount(fileDoc.getPageCount())
                .creditCost(fileDoc.getCreditCost() != null ? fileDoc.getCreditCost() : 0)
                .viewCount(fileDoc.getViewCount())
                .downloadCount(fileDoc.getDownloadCount())
                .rating(fileDoc.getRating())
                .reviewCount(fileDoc.getReviewCount())
                .authorName(authorName)
                .authorAvatar(authorAvatar)
                .build();
    }

    /**
     * 3. Hàm phụ cập nhật dữ liệu khi người dùng thực hiện tải file thành công
     */
    public void incrementDownloadCount(String fileId) {
        fileMetadataRepository.findById(fileId).ifPresent(file -> {
            file.setDownloadCount(file.getDownloadCount() + 1);
            fileMetadataRepository.save(file);
        });
    }

    private FileMetadataDTO mapToDTO(hcmuaf.edu.vn.backend.document.FileMetadataDocument document) {
        return FileMetadataDTO.builder()
                .id(document.getId())
                .name(document.getName())
                .title(document.getTitle() != null ? document.getTitle() : document.getName())
                .type(document.getType())
                .size(document.getSize())
                .clerkId(document.getClerkId())
                .isPublic(document.getIsPublic())
                .fileLocation(document.getFileLocation())
                .uploadedAt(document.getUploadedAt())
                .universityId(document.getUniversityId())
                .subjectCode(document.getSubjectCode())
                .subjectName(document.getSubjectName())
                .categoryId(document.getCategoryId())
                .docType(document.getDocType())
                .description(document.getDescription())
                .pageCount(document.getPageCount())
                .creditCost(document.getCreditCost())
                .viewCount(document.getViewCount())
                .downloadCount(document.getDownloadCount())
                .rating(document.getRating())
                .reviewCount(document.getReviewCount())
                .build();
    }
}
