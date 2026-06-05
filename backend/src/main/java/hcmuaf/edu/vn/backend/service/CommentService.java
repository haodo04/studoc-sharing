package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.CommentDocument;
import hcmuaf.edu.vn.backend.document.ProfileDocument;
import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import hcmuaf.edu.vn.backend.dto.CommentDTO;
import hcmuaf.edu.vn.backend.repository.CommentRepository;
import hcmuaf.edu.vn.backend.repository.FileMetadataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final FileMetadataRepository fileMetadataRepository;
    private final ProfileService profileService;

    public List<CommentDTO> getCommentsByFileId(String fileId) {
        return commentRepository.findByFileIdOrderByCreatedAtDesc(fileId).stream()
                .map(c -> CommentDTO.builder()
                        .id(c.getId())
                        .fileId(c.getFileId())
                        .clerkId(c.getClerkId())
                        .userFullName(c.getUserFullName())
                        .userPhotoUrl(c.getUserPhotoUrl())
                        .content(c.getContent())
                        .rating(c.getRating())
                        .createdAt(c.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public CommentDTO addComment(String fileId, CommentDTO dto) {
        ProfileDocument user = profileService.getCurrentProfile();
        String clerkId = user.getClerkId();

        Optional<CommentDocument> existingCommentOpt = commentRepository.findByFileIdAndClerkId(fileId, clerkId);

        CommentDocument comment;

        if (existingCommentOpt.isPresent()) {
            comment = existingCommentOpt.get();
            comment.setContent(dto.getContent());
            comment.setRating(dto.getRating());
            comment.setUserFullName(user.getLastName() + " " + user.getFirstName());
            comment.setUserPhotoUrl(user.getPhotoUrl());
            comment.setCreatedAt(LocalDateTime.now());
        } else {
            comment = CommentDocument.builder()
                    .fileId(fileId)
                    .clerkId(clerkId)
                    .userFullName(user.getLastName() + " " + user.getFirstName())
                    .userPhotoUrl(user.getPhotoUrl())
                    .content(dto.getContent())
                    .rating(dto.getRating())
                    .createdAt(LocalDateTime.now())
                    .build();
        }

        comment = commentRepository.save(comment);

        List<CommentDocument> allCommentsOfFile = commentRepository.findByFileIdOrderByCreatedAtDesc(fileId);
        int reviewCount = allCommentsOfFile.size();

        double averageRating = 0.0;
        if (reviewCount > 0) {
            double sumRating = allCommentsOfFile.stream().mapToDouble(CommentDocument::getRating).sum();
            averageRating = Math.round((sumRating / reviewCount) * 10.0) / 10.0;
        }

        FileMetadataDocument file = fileMetadataRepository.findById(fileId).orElse(null);
        if (file != null) {
            file.setReviewCount(reviewCount);
            file.setRating(averageRating);
            fileMetadataRepository.save(file);
        }

        dto.setId(comment.getId());
        dto.setClerkId(comment.getClerkId());
        dto.setUserFullName(comment.getUserFullName());
        dto.setUserPhotoUrl(comment.getUserPhotoUrl());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }
}