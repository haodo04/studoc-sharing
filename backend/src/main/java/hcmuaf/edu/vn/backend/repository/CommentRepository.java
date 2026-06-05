package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.CommentDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends MongoRepository<CommentDocument, String> {
    // Lấy danh sách bình luận của một tài tài liệu (phục vụ hiển thị trang chi tiết)
    List<CommentDocument> findByFileIdOrderByCreatedAtDesc(String fileId);

    // Kiểm tra xem người dùng này đã đánh giá tài liệu này chưa
    Optional<CommentDocument> findByFileIdAndClerkId(String fileId, String clerkId);
}
