package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.FavoriteDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface FavoriteRepository extends MongoRepository<FavoriteRepository, String> {
    // Kiểm tra xem User này đã bookmark file này chưa (Để hiển thị icon bookmark sáng hay tối trên FE
    Optional<FavoriteDocument> findByClerkIdAndFileId(String clerkId, String fileId);

    // Xóa bookmark khi người dùng bấm hủy lưu
    void deleteByClerkIdAndFileId(String clerkId, String fileId);
}
