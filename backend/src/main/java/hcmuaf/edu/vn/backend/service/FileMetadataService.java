package hcmuaf.edu.vn.backend.service;

import com.documents4j.api.IConverter;
import com.documents4j.job.LocalConverter;
import hcmuaf.edu.vn.backend.document.DownloadHistoryDocument;
import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import hcmuaf.edu.vn.backend.document.ProfileDocument;
import hcmuaf.edu.vn.backend.dto.DownloadHistoryDTO;
import hcmuaf.edu.vn.backend.dto.FileMetadataDTO;
import hcmuaf.edu.vn.backend.dto.response.FileDetailResponseDTO;
import hcmuaf.edu.vn.backend.exceptions.BadRequestException;
import hcmuaf.edu.vn.backend.exceptions.ResourceNotFoundException;
import hcmuaf.edu.vn.backend.repository.DownloadHistoryRepository;
import hcmuaf.edu.vn.backend.repository.FileMetadataRepository;
import hcmuaf.edu.vn.backend.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
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

    @Autowired
    private  ProfileService profileService;
    @Autowired
    private FileMetadataRepository fileMetadataRepository;
    @Autowired
    private UserCreditsService userCreditsService;
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private ProfileRepository profileRepository;
    @Autowired
    private DownloadHistoryRepository downloadHistoryRepository;

    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
    private final String UPLOAD_DIR = "uploads/";
    private final String THUMBNAIL_DIR = "uploads/thumbnails/";

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
            String fileIdClean = storedFileName.replace(fileExtension, ""); // Cắt bỏ extension để lấy fileId sạch

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

            if (file.getContentType() != null && (
                    file.getContentType().equalsIgnoreCase("application/pdf") ||
                            file.getContentType().contains("word") ||
                            file.getContentType().contains("officedocument.wordprocessingml.document")
            )) {

                String thumbUrl = generateMultiFormatThumbnail(targetLocation.toString(), fileIdClean, file.getContentType());

                document.setThumbnailUrl(thumbUrl != null ? thumbUrl : "/uploads/thumbnails/default-doc.png");
            } else {
                document.setThumbnailUrl("/uploads/thumbnails/default-doc.png");
            }

            FileMetadataDocument savedDoc = fileMetadataRepository.save(document);
            uploadedFilesResult.add(mapToDTO(savedDoc));

            successfullyUploadedCount++;
        }

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

                .fileLocation(doc.getFileLocation())

                .universityId(uniId)
                .categoryId(catId)
                .customUniversity(customUni)
                .customCategory(customCat)
                .subjectCode(doc.getSubjectCode())
                .subjectName(doc.getSubjectName())
                .thumbnailUrl(doc.getThumbnailUrl())
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

    private String generateMultiFormatThumbnail(String filePath, String fileId, String contentType) {
        try {
            Path thumbnailDirectory = this.fileStorageLocation.resolve("thumbnails");
            if (!Files.exists(thumbnailDirectory)) {
                Files.createDirectories(thumbnailDirectory);
            }

            File inputFile = new File(filePath);
            File pdfFileForRendering = null;

            if (contentType != null && contentType.equalsIgnoreCase("application/pdf")) {
                pdfFileForRendering = inputFile;
            }
            else if (contentType != null && (contentType.contains("word") || contentType.contains("officedocument.wordprocessingml.document"))) {
                File parentDir = inputFile.getParentFile();
                pdfFileForRendering = new File(parentDir, fileId + "_temp.pdf");

                try (InputStream docxInputStream = Files.newInputStream(inputFile.toPath());
                     OutputStream pdfOutputStream = Files.newOutputStream(pdfFileForRendering.toPath())) {
                    IConverter converter = LocalConverter.builder().build();
                    converter.convert(docxInputStream).as(com.documents4j.api.DocumentType.DOCX)
                            .to(pdfOutputStream).as(com.documents4j.api.DocumentType.PDF)
                            .execute();
                }
            }

            if (pdfFileForRendering != null && pdfFileForRendering.exists()) {
                try (PDDocument document = PDDocument.load(pdfFileForRendering)) {
                    if (document.getNumberOfPages() > 0) {
                        PDFRenderer pdfRenderer = new PDFRenderer(document);
                        BufferedImage bufferedImage = pdfRenderer.renderImageWithDPI(0, 120);

                        String thumbnailFileName = fileId + ".png";

                        File outputImageFile = thumbnailDirectory.resolve(thumbnailFileName).toFile();

                        ImageIO.write(bufferedImage, "png", outputImageFile);

                        if (!inputFile.equals(pdfFileForRendering)) {
                            pdfFileForRendering.delete();
                        }

                        return "/uploads/thumbnails/" + thumbnailFileName;
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Lỗi sinh thumbnail tự động cho file " + fileId + ": " + e.getMessage());
            e.printStackTrace();
        }

        return null;
    }

    public List<FileMetadataDTO> getFiles() {
        return fileMetadataRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void deleteFile(String id) {
        FileMetadataDocument document = fileMetadataRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài liệu không tồn tại với ID: " + id));

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

    public FileMetadataDTO processDownloadRequest(String fileId, String clerkId) {
        try {
            FileMetadataDocument document = fileMetadataRepository.findById(fileId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài liệu"));

            int cost = document.getCreditCost() != null ? document.getCreditCost() : 0;

            boolean hasDownloadedBefore = downloadHistoryRepository
                    .findByClerkIdOrderByDownloadedAtDesc(clerkId)
                    .stream()
                    .anyMatch(history -> history.getFileId().equals(fileId));

            if (hasDownloadedBefore) {
                cost = 0;
            }

            if (cost > 0) {
                userCreditsService.deductCreditsForDownload(clerkId, cost);
            }

            DownloadHistoryDocument historyRecord = DownloadHistoryDocument.builder()
                    .clerkId(clerkId)
                    .fileId(fileId)
                    .creditsSpent(cost)
                    .downloadedAt(java.time.LocalDateTime.now())
                    .build();

            downloadHistoryRepository.save(historyRecord);

            document.setDownloadCount(document.getDownloadCount() + 1);
            FileMetadataDocument savedDoc = fileMetadataRepository.save(document);

            return convertToDTO(savedDoc);

        } catch (NullPointerException npe) {
            npe.printStackTrace();
            throw npe;
        }
    }

    public List<FileMetadataDTO> getPublicFiles() {
        return fileMetadataRepository.findByIsPublicTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<FileMetadataDTO> getRelatedDocuments(String id, int limit) {
        FileMetadataDocument currentFile = fileMetadataRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài liệu"));

        Pageable pageable = PageRequest.of(0, limit);

        List<FileMetadataDocument> relatedDocuments = fileMetadataRepository
                .findByCategoryIdAndIsPublicTrueAndIdNot(currentFile.getCategoryId(), id, pageable);

        return relatedDocuments.stream()
                .map(this::convertToDTO)
                .toList();
    }

    private FileMetadataDTO convertToDTO(FileMetadataDocument doc) {
        if (doc == null) {
            return null;
        }

        FileMetadataDTO dto = new FileMetadataDTO();
        dto.setId(doc.getId());
        dto.setName(doc.getName());
        dto.setTitle(doc.getTitle());
        dto.setType(doc.getType());
        dto.setSize(doc.getSize());
        dto.setClerkId(doc.getClerkId());
        dto.setIsPublic(doc.getIsPublic());
        dto.setFileLocation(doc.getFileLocation());
        dto.setUploadedAt(doc.getUploadedAt());

        dto.setUniversityId(doc.getUniversityId());
        dto.setSubjectCode(doc.getSubjectCode());
        dto.setSubjectName(doc.getSubjectName());
        dto.setCategoryId(doc.getCategoryId());
        dto.setCustomUniversity(doc.getCustomUniversity());
        dto.setCustomCategory(doc.getCustomCategory());
        dto.setDocType(doc.getDocType());
        dto.setDescription(doc.getDescription());
        dto.setThumbnailUrl(doc.getThumbnailUrl());

        dto.setPageCount(doc.getPageCount());
        dto.setCreditCost(doc.getCreditCost());
        dto.setViewCount(doc.getViewCount());
        dto.setDownloadCount(doc.getDownloadCount());
        dto.setRating(doc.getRating());
        dto.setReviewCount(doc.getReviewCount());

        return dto;
    }

    public FileDetailResponseDTO getFileById(String id) {
        org.springframework.data.mongodb.core.query.Query query =
                new org.springframework.data.mongodb.core.query.Query(org.springframework.data.mongodb.core.query.Criteria.where("_id").is(id));
        org.springframework.data.mongodb.core.query.Update update =
                new org.springframework.data.mongodb.core.query.Update().inc("viewCount", 1);

        FileMetadataDocument updatedDoc = mongoTemplate.findAndModify(
                query,
                update,
                org.springframework.data.mongodb.core.FindAndModifyOptions.options().returnNew(true),
                FileMetadataDocument.class
        );

        if (updatedDoc == null) {
            throw new ResourceNotFoundException("Không tìm thấy tài liệu trong DB với ID: " + id);
        }

        FileDetailResponseDTO dto = FileDetailResponseDTO.builder()
                .id(updatedDoc.getId())
                .title(updatedDoc.getTitle())
                .type(updatedDoc.getType())
                .size(updatedDoc.getSize())
                .fileLocation(updatedDoc.getFileLocation())
                .uploadedAt(updatedDoc.getUploadedAt())
                .universityId(updatedDoc.getUniversityId())
                .subjectCode(updatedDoc.getSubjectCode())
                .subjectName(updatedDoc.getSubjectName())
                .docType(updatedDoc.getDocType())
                .description(updatedDoc.getDescription())
                .pageCount(updatedDoc.getPageCount())
                .creditCost(updatedDoc.getCreditCost())
                .viewCount(updatedDoc.getViewCount())
                .downloadCount(updatedDoc.getDownloadCount())
                .rating(updatedDoc.getRating())
                .reviewCount(updatedDoc.getReviewCount())
                .thumbnailUrl(updatedDoc.getThumbnailUrl())
                .build();

        dto.setAuthorName("Thành viên StuDoc");
        dto.setAuthorAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100");

        String uploaderClerkId = updatedDoc.getClerkId();
        if (uploaderClerkId != null) {
            ProfileDocument profile = profileRepository.findByClerkId(uploaderClerkId);

            if (profile != null) {
                String firstName = profile.getFirstName() != null ? profile.getFirstName() : "";
                String lastName = profile.getLastName() != null ? profile.getLastName() : "";
                String fullName = (firstName + " " + lastName).trim();

                if (!fullName.isEmpty()) {
                    dto.setAuthorName(fullName);
                }
                if (profile.getPhotoUrl() != null) {
                    dto.setAuthorAvatar(profile.getPhotoUrl());
                }
            }
        }

        return dto;
    }

    public List<FileMetadataDTO> getFilesByClerkId(String clerkId) {
        List<FileMetadataDocument> entities = fileMetadataRepository.findByClerkIdOrderByUploadedAtDesc(clerkId);

        return entities.stream()
                .map(this::convertToDTO)
                .toList();
    }

    public List<DownloadHistoryDTO> getDownloadHistoryByClerkId(String clerkId) {
        List<DownloadHistoryDocument> histories = downloadHistoryRepository.findByClerkIdOrderByDownloadedAtDesc(clerkId);

        return histories.stream().map(history -> {
            DownloadHistoryDTO dto = DownloadHistoryDTO.builder()
                    .id(history.getId())
                    .clerkId(history.getClerkId())
                    .fileId(history.getFileId())
                    .creditsSpent(history.getCreditsSpent())
                    .downloadedAt(history.getDownloadedAt())
                    .build();

            fileMetadataRepository.findById(history.getFileId()).ifPresent(file -> {
                dto.setFileName(file.getName());
                dto.setFileSize(file.getSize());
                dto.setFileType(file.getType());
            });

            return dto;
        }).collect(Collectors.toList());
    }
}