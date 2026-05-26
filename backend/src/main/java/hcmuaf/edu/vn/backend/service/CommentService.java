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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final FileMetadataRepository fileMetadataRepository;
    private final ProfileService profileService;

    // 1. Lấy danh sách bình luận của 1 file
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

    // 2. Thêm bình luận mới + Tự động tính toán lại điểm rating trung bình của File
    public CommentDTO addComment(String fileId, CommentDTO dto) {
        ProfileDocument user = profileService.getCurrentProfile();

        CommentDocument comment = CommentDocument.builder()
                .fileId(fileId)
                .clerkId(user.getClerkId())
                .userFullName(user.getLastName() + " " + user.getFirstName())
                .userPhotoUrl(user.getPhotoUrl())
                .content(dto.getContent())
                .rating(dto.getRating())
                .createdAt(LocalDateTime.now())
                .build();

        comment = commentRepository.save(comment);

        // Logic cập nhật số sao và lượt đánh giá vào bảng files
        List<CommentDocument> allCommentsOfFile = commentRepository.findByFileIdOrderByCreatedAtDesc(fileId);
        int reviewCount = allCommentsOfFile.size();
        double sumRating = allCommentsOfFile.stream().mapToDouble(CommentDocument::getRating).sum();
        double averageRating = Math.round((sumRating / reviewCount) * 10.0) / 10.0;

        FileMetadataDocument file = fileMetadataRepository.findById(fileId).orElse(null);
        if (file != null) {
            file.setReviewCount(reviewCount);
            file.setRating(averageRating);
            fileMetadataRepository.save(file);
        }

        dto.setId(comment.getId());
        dto.setUserFullName(comment.getUserFullName());
        dto.setUserPhotoUrl(comment.getUserPhotoUrl());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }
}