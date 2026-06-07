package hcmuaf.edu.vn.backend.repository;

import hcmuaf.edu.vn.backend.document.DownloadHistoryDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface DownloadHistoryRepository extends MongoRepository<DownloadHistoryDocument, String> {
    // Tìm kiếm lịch sử dựa trên cặp mã User và mã File
    Optional<DownloadHistoryDocument> findByClerkIdAndFileId(String clerkId, String fileId);

    List<DownloadHistoryDocument> findByClerkIdOrderByDownloadedAtDesc(String clerkId);
}
