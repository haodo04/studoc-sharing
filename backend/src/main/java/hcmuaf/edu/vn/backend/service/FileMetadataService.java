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

    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public List<FileMetadataDTO> upLoadFiles(MultipartFile[] files) throws IOException {
        if (!Files.exists(this.fileStorageLocation)) {
            Files.createDirectories(this.fileStorageLocation);
        }

        ProfileDocument currentProfile = profileService.getCurrentProfile();
        String clerkId = currentProfile.getClerkId();

        List<FileMetadataDTO> uploadedFilesResult = new ArrayList<>();

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
            document.setTitle(originalFileName.replace(fileExtension, ""));
            document.setType(file.getContentType());
            document.setSize(file.getSize());
            document.setFileLocation(targetLocation.toString());
            document.setClerkId(clerkId);
            document.setIsPublic(true);
            document.setUploadedAt(LocalDateTime.now());

            document.setViewCount(0);
            document.setDownloadCount(0);
            document.setRating(0.0);
            document.setReviewCount(0);
            document.setUniversityId(null);
            document.setSubjectCode("CHƯA_CÓ");
            document.setSubjectName("Tài liệu chưa phân loại");
            document.setCategoryId(null);
            document.setDocType("Khác");
            document.setPageCount(1);
            document.setCreditCost(0);

            FileMetadataDocument savedDoc = fileMetadataRepository.save(document);
            uploadedFilesResult.add(mapToDTO(savedDoc));
        }

        return uploadedFilesResult;
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

    private FileMetadataDTO mapToDTO(FileMetadataDocument document) {
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