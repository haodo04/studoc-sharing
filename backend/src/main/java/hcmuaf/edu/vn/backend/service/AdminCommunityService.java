package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.CommentDocument;
import hcmuaf.edu.vn.backend.document.DiscussionDocument;
import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import hcmuaf.edu.vn.backend.dto.admin.AdminCommunityDTO;
import hcmuaf.edu.vn.backend.repository.CommentRepository;
import hcmuaf.edu.vn.backend.repository.DiscussionRepository;
import hcmuaf.edu.vn.backend.repository.FileMetadataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminCommunityService {

    private final CommentRepository commentRepository;
    private final DiscussionRepository discussionRepository;
    private final FileMetadataRepository fileMetadataRepository;

    public List<AdminCommunityDTO> getAllActivities() {
        List<CommentDocument> comments = commentRepository.findAll();
        List<DiscussionDocument> discussions = discussionRepository.findAll();
        
        List<FileMetadataDocument> files = fileMetadataRepository.findAll();
        Map<String, String> fileTitleMap = files.stream()
                .collect(Collectors.toMap(FileMetadataDocument::getId, 
                    f -> f.getTitle() != null ? f.getTitle() : f.getName(), 
                    (t1, t2) -> t1));

        List<AdminCommunityDTO> activities = new ArrayList<>();

        for (CommentDocument c : comments) {
            activities.add(AdminCommunityDTO.builder()
                    .id(c.getId())
                    .type("COMMENT")
                    .documentId(c.getFileId())
                    .documentTitle(fileTitleMap.getOrDefault(c.getFileId(), "Unknown Document"))
                    .authorName(c.getUserFullName())
                    .authorPhotoUrl(c.getUserPhotoUrl())
                    .content(c.getContent())
                    .rating(c.getRating())
                    .isDeleted(false) // Comments are hard deleted
                    .createdAt(c.getCreatedAt())
                    .build());
        }

        for (DiscussionDocument d : discussions) {
            activities.add(AdminCommunityDTO.builder()
                    .id(d.getId())
                    .type("DISCUSSION")
                    .documentId(d.getFileId())
                    .documentTitle(fileTitleMap.getOrDefault(d.getFileId(), "Unknown Document"))
                    .authorName(d.getUserFullName())
                    .authorPhotoUrl(d.getUserPhotoUrl())
                    .content(d.getContent())
                    .rating(null)
                    .isDeleted(d.isDeleted()) // Discussions support soft delete
                    .createdAt(d.getCreatedAt())
                    .build());
        }

        // Sort descending by createdAt
        activities.sort(Comparator.comparing(AdminCommunityDTO::getCreatedAt, 
                Comparator.nullsLast(Comparator.reverseOrder())));

        return activities;
    }

    public void deleteActivity(String type, String id) {
        if ("COMMENT".equalsIgnoreCase(type)) {
            commentRepository.deleteById(id);
        } else if ("DISCUSSION".equalsIgnoreCase(type)) {
            // Soft delete for discussion
            discussionRepository.findById(id).ifPresent(d -> {
                d.setDeleted(true);
                discussionRepository.save(d);
            });
        } else {
            throw new IllegalArgumentException("Unknown activity type: " + type);
        }
    }
}
