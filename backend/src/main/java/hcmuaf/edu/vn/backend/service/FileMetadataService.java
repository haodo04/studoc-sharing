package hcmuaf.edu.vn.backend.service;

import com.documents4j.api.IConverter;
import com.documents4j.job.LocalConverter;
import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import hcmuaf.edu.vn.backend.document.ProfileDocument;
import hcmuaf.edu.vn.backend.dto.FileMetadataDTO;
import hcmuaf.edu.vn.backend.exceptions.BadRequestException;
import hcmuaf.edu.vn.backend.exceptions.ResourceNotFoundException;
import hcmuaf.edu.vn.backend.repository.FileMetadataRepository;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class FileMetadataService {

    private final ProfileService profileService;
    private final FileMetadataRepository fileMetadataRepository;
    private final UserCreditsService userCreditsService;
    private final MongoTemplate mongoTemplate;

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

    private String generatePdfThumbnail(String pdfFilePath, String fileId) {
        try {
            Path thumbnailPath = Paths.get(THUMBNAIL_DIR);
            if (!Files.exists(thumbnailPath)) {
                Files.createDirectories(thumbnailPath);
            }

            File pdfFile = new File(pdfFilePath);
            try (PDDocument document = PDDocument.load(pdfFile)) {

                if (document.getNumberOfPages() > 0) {
                    PDFRenderer pdfRenderer = new PDFRenderer(document);

                    BufferedImage bufferedImage = pdfRenderer.renderImageWithDPI(0, 150);

                    String thumbnailFileName = fileId + ".png";
                    File outputImageFile = new File(THUMBNAIL_DIR + thumbnailFileName);

                    ImageIO.write(bufferedImage, "png", outputImageFile);

                    return "/uploads/thumbnails/" + thumbnailFileName;
                }
            }
        } catch (Exception e) {
            System.err.println("Không thể tạo thumbnail cho file ID " + fileId + ": " + e.getMessage());
        }
        return null;
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

                        System.out.println("--- [SUCCESS] Đã tạo Thumbnail thành công tại: " + outputImageFile.getAbsolutePath());

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

    public FileMetadataDTO getFileById(String id) {
        Query query = new Query(Criteria.where("_id").is(id));

        Update update = new Update().inc("viewCount", 1);

        FileMetadataDocument updatedDoc = mongoTemplate.findAndModify(
                query,
                update,
                FileMetadataDocument.class
        );

        if (updatedDoc == null) {
            throw new RuntimeException("Không tìm thấy tài liệu trong DB với ID: " + id);
        }

        FileMetadataDTO dto = new FileMetadataDTO();

        dto.setId(updatedDoc.getId());
        dto.setName(updatedDoc.getName());
        dto.setTitle(updatedDoc.getTitle());
        dto.setType(updatedDoc.getType());
        dto.setSize(updatedDoc.getSize());
        dto.setClerkId(updatedDoc.getClerkId());
        dto.setIsPublic(updatedDoc.getIsPublic());
        dto.setFileLocation(updatedDoc.getFileLocation());
        dto.setUploadedAt(updatedDoc.getUploadedAt());

        dto.setUniversityId(updatedDoc.getUniversityId());
        dto.setSubjectCode(updatedDoc.getSubjectCode());
        dto.setSubjectName(updatedDoc.getSubjectName());
        dto.setCategoryId(updatedDoc.getCategoryId());
        dto.setCustomUniversity(updatedDoc.getCustomUniversity());
        dto.setCustomCategory(updatedDoc.getCustomCategory());
        dto.setDocType(updatedDoc.getDocType());
        dto.setDescription(updatedDoc.getDescription());
        dto.setPageCount(updatedDoc.getPageCount());
        dto.setCreditCost(updatedDoc.getCreditCost());

        dto.setViewCount(updatedDoc.getViewCount());
        dto.setDownloadCount(updatedDoc.getDownloadCount());
        dto.setRating(updatedDoc.getRating());
        dto.setReviewCount(updatedDoc.getReviewCount());
        dto.setThumbnailUrl(updatedDoc.getThumbnailUrl());

        return dto;
    }
}