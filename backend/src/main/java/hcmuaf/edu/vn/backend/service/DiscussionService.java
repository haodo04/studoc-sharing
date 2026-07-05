package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.DiscussionDocument;
import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import hcmuaf.edu.vn.backend.repository.DiscussionRepository;
import hcmuaf.edu.vn.backend.repository.FileMetadataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiscussionService {

    private final DiscussionRepository discussionRepository;
    private final FileMetadataRepository fileMetadataRepository;

    public List<DiscussionDocument> getByFile(String fileId) {
        return discussionRepository.findByFileIdOrderByCreatedAtAsc(fileId);
    }

    public DiscussionDocument create(String fileId, String parentId, String clerkId,
                                     String fullName, String photoUrl, String content) {
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Nội dung không được để trống");
        }

        // nếu là reply, đảm bảo comment cha tồn tại và cùng fileId (tránh reply xuyên tài liệu)
        if (parentId != null) {
            DiscussionDocument parent = discussionRepository.findById(parentId)
                    .orElseThrow(() -> new IllegalArgumentException("Bình luận cha không tồn tại"));
            if (!parent.getFileId().equals(fileId)) {
                throw new IllegalArgumentException("Bình luận cha không thuộc tài liệu này");
            }
        }

        FileMetadataDocument file = fileMetadataRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("Tài liệu không tồn tại"));

        DiscussionDocument doc = DiscussionDocument.builder()
                .fileId(fileId)
                .parentId(parentId)
                .clerkId(clerkId)
                .userFullName(fullName)
                .userPhotoUrl(photoUrl)
                .content(content.trim())
                .isAuthorReply(clerkId.equals(file.getClerkId()))
                .deleted(false)
                .edited(false)
                .createdAt(LocalDateTime.now())
                .build();

        return discussionRepository.save(doc);
    }

    public DiscussionDocument update(String id, String clerkId, String newContent) {
        DiscussionDocument doc = getOwnedOrThrow(id, clerkId);
        if (doc.isDeleted()) {
            throw new IllegalStateException("Không thể sửa bình luận đã bị xóa");
        }
        doc.setContent(newContent.trim());
        doc.setEdited(true);
        doc.setUpdatedAt(LocalDateTime.now());
        return discussionRepository.save(doc);
    }

    public void delete(String id, String clerkId) {
        DiscussionDocument doc = getOwnedOrThrow(id, clerkId);

        long childCount = discussionRepository.countByParentId(id);
        if (childCount > 0) {
            // còn reply con -> soft delete để không vỡ cây
            doc.setDeleted(true);
            doc.setContent(null);
            doc.setUpdatedAt(LocalDateTime.now());
            discussionRepository.save(doc);
        } else {
            // leaf node -> xóa cứng luôn cho gọn
            discussionRepository.deleteById(id);
        }
    }

    private DiscussionDocument getOwnedOrThrow(String id, String clerkId) {
        DiscussionDocument doc = discussionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bình luận không tồn tại"));
        if (!doc.getClerkId().equals(clerkId)) {
            throw new SecurityException("Bạn không có quyền thao tác trên bình luận này");
        }
        return doc;
    }
}