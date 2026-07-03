package hcmuaf.edu.vn.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import hcmuaf.edu.vn.backend.document.DownloadHistoryDocument;
import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import hcmuaf.edu.vn.backend.document.ProfileDocument;
import hcmuaf.edu.vn.backend.document.UnlockHistoryDocument;
import hcmuaf.edu.vn.backend.dto.DownloadHistoryDTO;
import hcmuaf.edu.vn.backend.dto.FileMetadataDTO;
import hcmuaf.edu.vn.backend.dto.response.FileDetailResponseDTO;
import hcmuaf.edu.vn.backend.exceptions.BadRequestException;
import hcmuaf.edu.vn.backend.exceptions.ResourceNotFoundException;
import hcmuaf.edu.vn.backend.repository.DownloadHistoryRepository;
import hcmuaf.edu.vn.backend.repository.FileMetadataRepository;
import hcmuaf.edu.vn.backend.repository.ProfileRepository;
import hcmuaf.edu.vn.backend.repository.UnlockHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileMetadataService {

    @Autowired
    private ProfileService profileService;
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
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private UnlockHistoryRepository unlockHistoryRepository;


    public List<FileMetadataDTO> upLoadFiles(MultipartFile[] files, FileMetadataDTO dto) throws IOException {
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
            String lowerExtension = fileExtension.toLowerCase();

            String resourceType = lowerExtension.equals(".pdf") ? "image" : "raw";

            Map<String, Object> params = ObjectUtils.asMap(
                    "asset_folder", "studoc-share/documents",
                    "use_filename_as_display_name", true,
                    "resource_type", resourceType,
                    "unique_filename", true,
                    "pages", true,
                    "access_mode", "public"
            );

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
            String cloudinaryUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            FileMetadataDocument document = new FileMetadataDocument();
            document.setName(originalFileName);
            document.setType(file.getContentType());
            document.setSize(file.getSize());
            document.setFileLocation(cloudinaryUrl);
            document.setClerkId(clerkId);
            document.setUploadedAt(LocalDateTime.now());

            String thumbnailPublicId = publicId;
            String viewableUrl = null;

            boolean isPdf = lowerExtension.equals(".pdf");
            boolean isOffice = lowerExtension.equals(".docx") || lowerExtension.equals(".doc") ||
                    lowerExtension.equals(".pptx") || lowerExtension.equals(".ppt");

            if (isPdf) {
                viewableUrl = cloudinaryUrl;
            } else if (isOffice) {
                try {
                    byte[] pdfBytes = convertOfficeToPdf(file.getInputStream(), lowerExtension);

                    Map<String, Object> viewParams = ObjectUtils.asMap(
                            "asset_folder", "studoc-share/viewable",
                            "resource_type", "image",
                            "unique_filename", true,
                            "access_mode", "public"
                    );
                    Map viewResult = cloudinary.uploader().upload(pdfBytes, viewParams);

                    viewableUrl = (String) viewResult.get("secure_url");
                    thumbnailPublicId = (String) viewResult.get("public_id");
                } catch (Exception e) {
                    System.err.println("Lỗi convert Office→PDF (thumbnail + viewable): " + e.getMessage());
                }
            }

            document.setViewableUrl(viewableUrl);

            String cleanThumbId = thumbnailPublicId;
            if (cleanThumbId.endsWith(".pdf")) {
                cleanThumbId = cleanThumbId.substring(0, cleanThumbId.lastIndexOf("."));
            }

            String generatedThumbUrl = cloudinary.url()
                    .resourceType("image")
                    .transformation(
                            new com.cloudinary.Transformation()
                                    .width(400).height(250).crop("fill")
                                    .page(1)
                    )
                    .format("jpg")
                    .generate(cleanThumbId);

            document.setThumbnailUrl(generatedThumbUrl);

            document.setTitle(StringUtils.hasText(dto.getTitle()) ? dto.getTitle() : originalFileName.replace(fileExtension, ""));
            document.setDescription(dto.getDescription());
            document.setDocType(dto.getDocType());
            document.setCreditCost(dto.getCreditCost() != null ? dto.getCreditCost() : 0);
            document.setIsPublic(dto.getIsPublic() != null ? dto.getIsPublic() : true);

            document.setViewCount(0);
            document.setDownloadCount(0);
            document.setRating(0.0);
            document.setReviewCount(0);

            int pages = 1;
            if (uploadResult.containsKey("pages") && uploadResult.get("pages") != null) {
                try {
                    pages = Integer.parseInt(uploadResult.get("pages").toString());
                } catch (NumberFormatException ignored) {}
            }
            document.setPageCount(pages);

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

            document.setSubjectCode(StringUtils.hasText(dto.getSubjectCode()) ? dto.getSubjectCode().toUpperCase() : "CHƯA_CÓ");
            document.setSubjectName(StringUtils.hasText(dto.getSubjectName()) ? dto.getSubjectName() : "Tài liệu tự do");

            FileMetadataDocument savedDoc = fileMetadataRepository.save(document);
            uploadedFilesResult.add(mapToDTO(savedDoc));
            successfullyUploadedCount++;
        }

        if (successfullyUploadedCount > 0) {
            userCreditsService.addCredits(clerkId, 2);
        }

        return uploadedFilesResult;
    }

    public void deleteFile(String fileId) throws IOException {
        FileMetadataDocument document = fileMetadataRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài liệu cần xóa"));

        String fileLocation = document.getFileLocation();

        if (fileLocation != null && fileLocation.contains("cloudinary.com")) {
            try {
                String[] urlParts = fileLocation.split("/upload/");
                if (urlParts.length > 1) {
                    String path = urlParts[1];
                    if (path.startsWith("v")) {
                        path = path.substring(path.indexOf("/") + 1);
                    }
                    String publicId = path;
                    if (publicId.contains(".")) {
                        publicId = publicId.substring(0, publicId.lastIndexOf("."));
                    }

                    try {
                        cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "image"));
                        System.out.println("Đã xóa file (image) trên Cloudinary: " + publicId);
                    } catch (Exception e1) {
                        try {
                            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "raw"));
                            System.out.println("Đã xóa file (raw) trên Cloudinary: " + publicId);
                        } catch (Exception e2) {
                            System.err.println("Không thể xóa file trên Cloudinary: " + e2.getMessage());
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Lỗi khi xóa file trên Cloudinary nhưng vẫn tiếp tục xóa DB: " + e.getMessage());
            }
        }

        fileMetadataRepository.delete(document);
    }

    private byte[] convertOfficeToPdf(java.io.InputStream officeInputStream, String extension) throws IOException {
        java.io.ByteArrayOutputStream pdfOutputStream = new java.io.ByteArrayOutputStream();
        try {
            com.documents4j.api.IConverter converter = com.documents4j.job.LocalConverter.builder().build();
            if (extension.contains("doc")) {
                converter.convert(officeInputStream).as(com.documents4j.api.DocumentType.MS_WORD)
                        .to(pdfOutputStream).as(com.documents4j.api.DocumentType.PDF).execute();
            } else if (extension.contains("ppt")) {
                com.documents4j.api.DocumentType pptType = new com.documents4j.api.DocumentType("application/vnd.ms-powerpoint");
                converter.convert(officeInputStream).as(pptType)
                        .to(pdfOutputStream).as(com.documents4j.api.DocumentType.PDF).execute();
            }
            return pdfOutputStream.toByteArray();
        } finally {
            pdfOutputStream.close();
        }
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
                .viewableUrl(doc.getViewableUrl())
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
        FileMetadataDocument document = fileMetadataRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài liệu"));

        int cost = document.getCreditCost() != null ? document.getCreditCost() : 0;

        boolean hasDownloadedBefore = downloadHistoryRepository
                .findByClerkIdOrderByDownloadedAtDesc(clerkId)
                .stream()
                .anyMatch(history -> history.getFileId().equals(fileId));

        if (hasDownloadedBefore) {
            cost = 0;
        } else {
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
        }

        document.setDownloadCount(document.getDownloadCount() + 1);
        return mapToDTO(fileMetadataRepository.save(document));
    }

    public void unlockDocument(String fileId, String clerkId) {
        FileMetadataDocument document = fileMetadataRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài liệu cần mở khóa."));

        if (clerkId.equals(document.getClerkId())) {
            return;
        }

        boolean hasUnlockedBefore = unlockHistoryRepository.existsByClerkIdAndFileId(clerkId, fileId);

        if (hasUnlockedBefore) {
            return;
        }

        int cost = document.getCreditCost() != null ? document.getCreditCost() : 0;

        if (cost > 0) {
            userCreditsService.deductCreditsForDownload(clerkId, cost);
        }

        UnlockHistoryDocument unlockRecord = UnlockHistoryDocument.builder()
                .clerkId(clerkId)
                .fileId(fileId)
                .creditSpent(cost)
                .unlockedAt(java.time.LocalDateTime.now())
                .build();
        unlockHistoryRepository.save(unlockRecord);
    }

    public FileMetadataDTO processCleanDownloadRequest(String fileId, String clerkId) {
        FileMetadataDocument document = fileMetadataRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài liệu"));

        boolean isOwnerOrPurchased = clerkId.equals(document.getClerkId()) ||
                unlockHistoryRepository.existsByClerkIdAndFileId(clerkId, fileId);

        if (!isOwnerOrPurchased) {
            throw new SecurityException("Bạn chưa mở khóa tài liệu này. Vui lòng thanh toán bằng xu trước!");
        }

        document.setDownloadCount(document.getDownloadCount() + 1);
        return mapToDTO(fileMetadataRepository.save(document));
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
                .map(this::mapToDTO)
                .toList();
    }

    public FileDetailResponseDTO getFileById(String id, String currentClerkId) {
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
                .viewableUrl(updatedDoc.getViewableUrl())
                .build();

        boolean isUnlocked = false;
        if (currentClerkId != null) {
            if (currentClerkId.equals(updatedDoc.getClerkId())) {
                isUnlocked = true;
            } else {
                isUnlocked = unlockHistoryRepository.existsByClerkIdAndFileId(currentClerkId, id);
            }
        }
        dto.setUnlocked(isUnlocked);

        dto.setAuthorName("Thành viên StuDoc");
        dto.setAuthorAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100");

        String uploaderClerkId = updatedDoc.getClerkId();
        if (uploaderClerkId != null) {
            ProfileDocument profile = profileRepository.findByClerkId(uploaderClerkId);
            if (profile != null) {
                String firstName = profile.getFirstName() != null ? profile.getFirstName() : "";
                String lastName = profile.getLastName() != null ? profile.getLastName() : "";
                String fullName = (firstName + " " + lastName).trim();
                if (!fullName.isEmpty()) dto.setAuthorName(fullName);
                if (profile.getPhotoUrl() != null) dto.setAuthorAvatar(profile.getPhotoUrl());
            }
        }

        return dto;
    }

    public List<FileMetadataDTO> getFilesByClerkId(String clerkId) {
        List<FileMetadataDocument> entities = fileMetadataRepository.findByClerkIdOrderByUploadedAtDesc(clerkId);

        return entities.stream()
                .map(this::mapToDTO)
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