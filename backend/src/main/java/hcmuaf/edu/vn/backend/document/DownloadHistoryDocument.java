package hcmuaf.edu.vn.backend.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "download_histories")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DownloadHistoryDocument {
    @Id
    private String id;
    private String clerkId;       // Ai tải
    private String fileId;        // Tải tài liệu nào
    private Integer creditsSpent; // Số xu đã trừ tại thời điểm tải (để làm lịch sử giao dịch)
    private LocalDateTime downloadedAt;
}
