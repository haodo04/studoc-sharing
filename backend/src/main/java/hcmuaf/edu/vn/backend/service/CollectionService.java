package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.CollectionDocument;
import hcmuaf.edu.vn.backend.dto.response.CollectionContainingFileDTO;
import hcmuaf.edu.vn.backend.dto.response.CollectionDetailDTO;
import hcmuaf.edu.vn.backend.dto.response.CollectionSummaryDTO;
import hcmuaf.edu.vn.backend.exceptions.BadRequestException;
import hcmuaf.edu.vn.backend.exceptions.ResourceNotFoundException;
import hcmuaf.edu.vn.backend.repository.CollectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CollectionService {

    private final CollectionRepository collectionRepository;
    private final FileMetadataService fileMetadataService;

    private static final int MAX_NAME_LENGTH = 100;

    public List<CollectionSummaryDTO> listCollections(String clerkId) {
        return collectionRepository.findByClerkIdOrderByUpdatedAtDesc(clerkId).stream()
                .map(this::mapToSummary)
                .toList();
    }

    public CollectionDetailDTO getCollectionDetail(String collectionId, String clerkId) {
        CollectionDocument collection = requireOwnedCollection(collectionId, clerkId);

        List<hcmuaf.edu.vn.backend.dto.FileMetadataDTO> files =
                collection.getFileIds().isEmpty()
                        ? new ArrayList<>()
                        : fileMetadataService.getFilesByIds(collection.getFileIds());

        return CollectionDetailDTO.builder()
                .id(collection.getId())
                .name(collection.getName())
                .createdAt(collection.getCreatedAt())
                .files(files)
                .build();
    }

    public List<CollectionContainingFileDTO> getCollectionsContainingFile(String fileId, String clerkId) {
        return collectionRepository.findByClerkIdOrderByUpdatedAtDesc(clerkId).stream()
                .map(c -> CollectionContainingFileDTO.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .fileCount(c.getFileIds().size())
                        .containsFile(c.getFileIds().contains(fileId))
                        .build())
                .toList();
    }

    public CollectionSummaryDTO createCollection(String clerkId, String name) {
        String cleanName = validateName(name);

        CollectionDocument collection = CollectionDocument.builder()
                .clerkId(clerkId)
                .name(cleanName)
                .fileIds(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        CollectionDocument saved = collectionRepository.save(collection);
        return mapToSummary(saved);
    }

    public void renameCollection(String collectionId, String clerkId, String name) {
        String cleanName = validateName(name);
        CollectionDocument collection = requireOwnedCollection(collectionId, clerkId);
        collection.setName(cleanName);
        collection.setUpdatedAt(LocalDateTime.now());
        collectionRepository.save(collection);
    }

    public void deleteCollection(String collectionId, String clerkId) {
        CollectionDocument collection = requireOwnedCollection(collectionId, clerkId);
        collectionRepository.delete(collection);
    }

    public void addFileToCollection(String collectionId, String fileId, String clerkId) {
        CollectionDocument collection = requireOwnedCollection(collectionId, clerkId);
        if (!collection.getFileIds().contains(fileId)) {
            collection.getFileIds().add(fileId);
            collection.setUpdatedAt(LocalDateTime.now());
            collectionRepository.save(collection);
        }
    }

    public void removeFileFromCollection(String collectionId, String fileId, String clerkId) {
        CollectionDocument collection = requireOwnedCollection(collectionId, clerkId);
        collection.getFileIds().remove(fileId);
        collection.setUpdatedAt(LocalDateTime.now());
        collectionRepository.save(collection);
    }

    private CollectionDocument requireOwnedCollection(String collectionId, String clerkId) {
        return collectionRepository.findByIdAndClerkId(collectionId, clerkId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bộ sưu tập này hoặc bạn không có quyền truy cập!"));
    }

    private String validateName(String name) {
        if (!StringUtils.hasText(name)) {
            throw new BadRequestException("Tên bộ sưu tập không được để trống!");
        }
        String trimmed = name.trim();
        if (trimmed.length() > MAX_NAME_LENGTH) {
            throw new BadRequestException("Tên bộ sưu tập không được vượt quá " + MAX_NAME_LENGTH + " ký tự!");
        }
        return trimmed;
    }

    private CollectionSummaryDTO mapToSummary(CollectionDocument c) {
        return CollectionSummaryDTO.builder()
                .id(c.getId())
                .name(c.getName())
                .fileCount(c.getFileIds().size())
                .createdAt(c.getCreatedAt())
                .build();
    }
}