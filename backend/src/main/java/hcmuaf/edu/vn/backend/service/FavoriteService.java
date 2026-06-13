package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.FavoriteDocument;
import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import hcmuaf.edu.vn.backend.dto.FileMetadataDTO;
import hcmuaf.edu.vn.backend.dto.response.FavoriteResponseDTO;
import hcmuaf.edu.vn.backend.repository.FavoriteRepository;
import hcmuaf.edu.vn.backend.repository.FileMetadataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final FileMetadataRepository fileMetadataRepository;

    public boolean toggleFavorite(String clerkId, String fileId) {
        Optional<FavoriteDocument> existing = favoriteRepository.findByClerkIdAndFileId(clerkId, fileId);
        if (existing.isPresent()) {
            favoriteRepository.deleteByClerkIdAndFileId(clerkId, fileId);
            return false;
        } else {
            FavoriteDocument favorite = FavoriteDocument.builder()
                    .clerkId(clerkId)
                    .fileId(fileId)
                    .savedAt(LocalDateTime.now())
                    .build();
            favoriteRepository.save(favorite);
            return true;
        }
    }

    public boolean checkFavoriteStatus(String clerkId, String fileId) {
        return favoriteRepository.findByClerkIdAndFileId(clerkId, fileId).isPresent();
    }

    public List<FavoriteResponseDTO> getUserFavorites(String clerkId) {
        List<FavoriteDocument> favorites = favoriteRepository.findByClerkIdOrderBySavedAtDesc(clerkId);
        
        return favorites.stream().map(fav -> {
            FileMetadataDTO fileDTO = null;
            Optional<FileMetadataDocument> fileOpt = fileMetadataRepository.findById(fav.getFileId());
            if (fileOpt.isPresent()) {
                FileMetadataDocument doc = fileOpt.get();
                fileDTO = FileMetadataDTO.builder()
                        .id(doc.getId())
                        .name(doc.getName())
                        .title(doc.getTitle())
                        .type(doc.getType())
                        .size(doc.getSize())
                        .clerkId(doc.getClerkId())
                        .isPublic(doc.getIsPublic())
                        .fileLocation(doc.getFileLocation())
                        .uploadedAt(doc.getUploadedAt())
                        .universityId(doc.getUniversityId())
                        .subjectCode(doc.getSubjectCode())
                        .subjectName(doc.getSubjectName())
                        .categoryId(doc.getCategoryId())
                        .customUniversity(doc.getCustomUniversity())
                        .customCategory(doc.getCustomCategory())
                        .docType(doc.getDocType())
                        .description(doc.getDescription())
                        .pageCount(doc.getPageCount())
                        .creditCost(doc.getCreditCost())
                        .viewCount(doc.getViewCount())
                        .downloadCount(doc.getDownloadCount())
                        .rating(doc.getRating())
                        .reviewCount(doc.getReviewCount())
                        .thumbnailUrl(doc.getThumbnailUrl())
                        .build();
            }
            
            return FavoriteResponseDTO.builder()
                    .favoriteId(fav.getId())
                    .fileId(fav.getFileId())
                    .clerkId(fav.getClerkId())
                    .savedAt(fav.getSavedAt())
                    .file(fileDTO)
                    .build();
        }).collect(Collectors.toList());
    }
}
