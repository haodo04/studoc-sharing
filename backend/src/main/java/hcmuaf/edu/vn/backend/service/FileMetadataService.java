package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import hcmuaf.edu.vn.backend.document.ProfileDocument;
import hcmuaf.edu.vn.backend.dto.FileMetadataDTO;
import hcmuaf.edu.vn.backend.exceptions.BadRequestException;
import hcmuaf.edu.vn.backend.exceptions.ResourceNotFoundException;
import hcmuaf.edu.vn.backend.repository.FileMetadataRepository;
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
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileMetadataService {

    private final ProfileService profileService;
    private final FileMetadataRepository fileMetadataRepository;
    private final UserCreditsService userCreditsService;

    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public List<FileMetadataDTO> upLoadFiles(MultipartFile[] files, FileMetadataDTO dto) throws IOException {
        if (!Files.exists(this.fileStorageLocation)) {
            Files.createDirectories(this.fileStorageLocation);
        }

        ProfileDocument currentProfile = profileService.getCurrentProfile();
        String clerkId = currentProfile.getClerkId();

        List<FileMetadataDTO> uploadedFilesResult = new ArrayList<>();
        int successfullyUploadedCount = 0;

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = "";
            if (originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String storedFileName = UUID.randomUUID().toString() + fileExtension;

            Path targetLocation = this.fileStorageLocation.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            FileMetadataDocument document = new FileMetadataDocument();

            document.setName(originalFileName);
            document.setType(file.getContentType());
            document.setSize(file.getSize());
            document.setFileLocation(targetLocation.toString());
            document.setClerkId(clerkId);
            document.setUploadedAt(LocalDateTime.now());

            document.setTitle(StringUtils.hasText(dto.getTitle()) ? dto.getTitle() : originalFileName.replace(fileExtension, ""));
            document.setDescription(dto.getDescription());
            document.setDocType(dto.getDocType());
            document.setCreditCost(dto.getCreditCost() != null ? dto.getCreditCost() : 0);
            document.setIsPublic(dto.getIsPublic() != null ? dto.getIsPublic() : true);

            document.setViewCount(0);
            document.setDownloadCount(0);
            document.setRating(0.0);
            document.setReviewCount(0);
            document.setPageCount(1);

            if ("OTHER_UNI".equals(dto.getUniversityId()) && StringUtils.hasText(dto.getCustomUniversity())) {
                document.setUniversityId(dto.getCustomUniversity());
            } else {
                document.setUniversityId(dto.getUniversityId());
            }

            if ("OTHER_CAT".equals(dto.getCategoryId()) && StringUtils.hasText(dto.getCustomCategory())) {
                document.setCategoryId(dto.getCustomCategory());
            } else {
                document.setCategoryId(dto.getCategoryId());
            }

            document.setSubjectCode(StringUtils.hasText(dto.getSubjectCode()) ? dto.getSubjectCode() : "CHƯA_CÓ");
            document.setSubjectName(StringUtils.hasText(dto.getSubjectName()) ? dto.getSubjectName() : "Tài liệu tự do");

            FileMetadataDocument savedDoc = fileMetadataRepository.save(document);
            uploadedFilesResult.add(mapToDTO(savedDoc));

            successfullyUploadedCount++;
        }

        // Thưởng xu đóng góp khi hoàn thành
        if (successfullyUploadedCount > 0) {
            userCreditsService.addCredits(clerkId, 2);
        }

        return uploadedFilesResult;
    }

    private FileMetadataDTO mapToDTO(FileMetadataDocument doc) {
        if (doc == null) return null;

        List<String> systemUniIds = List.of("HUST", "NEU", "FTU", "HCMUTE");
        List<String> systemCatIds = List.of("it", "biz", "lang", "eng");

        String uniId = doc.getUniversityId();
        String catId = doc.getCategoryId();

        String customUni = null;
        String customCat = null;

        if (uniId != null && !systemUniIds.contains(uniId)) {
            customUni = uniId;
            uniId = "OTHER_UNI";
        }

        if (catId != null && !systemCatIds.contains(catId)) {
            customCat = catId;
            catId = "OTHER_CAT";
        }

        return FileMetadataDTO.builder()
                .id(doc.getId())
                .name(doc.getName())
                .title(doc.getTitle())
                .description(doc.getDescription())
                .type(doc.getType())
                .size(doc.getSize())
                .universityId(uniId)
                .categoryId(catId)
                .customUniversity(customUni)
                .customCategory(customCat)
                .subjectCode(doc.getSubjectCode())
                .subjectName(doc.getSubjectName())
                .docType(doc.getDocType())
                .creditCost(doc.getCreditCost())
                .isPublic(doc.getIsPublic())
                .viewCount(doc.getViewCount())
                .downloadCount(doc.getDownloadCount())
                .rating(doc.getRating())
                .reviewCount(doc.getReviewCount())
                .pageCount(doc.getPageCount())
                .uploadedAt(doc.getUploadedAt())
                .build();
    }

    public List<FileMetadataDTO> getFiles() {
        return fileMetadataRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public FileMetadataDTO getDownloadableFile(String id) {
        FileMetadataDocument document = fileMetadataRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy file hệ thống với ID yêu cầu: " + id));
        return mapToDTO(document);
    }

    public void deleteFile(String id) {
        FileMetadataDocument document = fileMetadataRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài liệu không tồn tại với ID: " + id));

        // Lấy thông tin user hiện tại bảo mật tuyệt đối
        ProfileDocument currentProfile = profileService.getCurrentProfile();

        if (!document.getClerkId().equals(currentProfile.getClerkId())) {
            throw new BadRequestException("Bạn không có quyền xóa tài liệu của người khác!");
        }

        try {
            Path filePath = Paths.get(document.getFileLocation());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Lỗi vật lý khi xóa tệp tin trên đĩa: " + e.getMessage());
        }

        fileMetadataRepository.delete(document);
    }

    public FileMetadataDTO togglePublic(String id) {
        FileMetadataDocument document = fileMetadataRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài liệu không tồn tại với ID: " + id));

        ProfileDocument currentProfile = profileService.getCurrentProfile();

        if (!document.getClerkId().equals(currentProfile.getClerkId())) {
            throw new BadRequestException("Bạn không có quyền thay đổi trạng thái tài liệu này!");
        }

        document.setIsPublic(!document.getIsPublic());
        return mapToDTO(fileMetadataRepository.save(document));
    }

    public void incrementDownloadCount(String fileId) {
        fileMetadataRepository.findById(fileId).ifPresent(file -> {
            file.setDownloadCount(file.getDownloadCount() + 1);
            fileMetadataRepository.save(file);
        });
    }


    public FileMetadataDTO processDownloadRequest(String fileId) {
        FileMetadataDocument document = fileMetadataRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài liệu"));

        int cost = document.getCreditCost() != null ? document.getCreditCost() : 0;

        userCreditsService.deductCreditsForDownload(cost);

        document.setDownloadCount(document.getDownloadCount() + 1);
        fileMetadataRepository.save(document);

        return mapToDTO(document);
    }
}