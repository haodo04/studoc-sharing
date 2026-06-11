package hcmuaf.edu.vn.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DownloadHistoryDTO {
    private String id;
    private String clerkId;
    private String fileId;
    private Integer creditsSpent;
    private LocalDateTime downloadedAt;

    private String fileName;
    private Long fileSize;
    private String fileType;
}
