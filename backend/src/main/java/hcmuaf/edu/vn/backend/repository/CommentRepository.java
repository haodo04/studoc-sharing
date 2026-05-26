package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.CommentDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<CommentDocument, String> {
    // Tìm tất cả bình luận thuộc về một file cụ thể, sắp xếp theo thời gian mới nhất
    List<CommentDocument> findByFileIdOrderByCreatedAtDesc(String fileId);
}
