package hcmuaf.edu.vn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentDTO {
    private String id;
    private String fileId;
    private String clerkId;
    private String userFullName;
    private String userPhotoUrl;
    private String content;
    private int rating;
    private LocalDateTime createdAt;
}