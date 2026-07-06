package hcmuaf.edu.vn.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminCommunityDTO {
    private String id;
    private String type; // "COMMENT" or "DISCUSSION"
    private String documentId;
    private String documentTitle;
    private String authorName;
    private String authorPhotoUrl;
    private String content;
    private Integer rating; // Nullable, only for COMMENTS
    private boolean isDeleted; // Useful for discussions to show soft-delete status
    private LocalDateTime createdAt;
}
