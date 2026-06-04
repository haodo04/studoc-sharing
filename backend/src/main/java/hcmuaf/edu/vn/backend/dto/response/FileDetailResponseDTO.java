package hcmuaf.edu.vn.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FileDetailResponseDTO {
    private String id;
    private String title;
    private String type;
    private long size;
    private String fileLocation;
    private LocalDateTime uploadedAt;
    private String universityId;
    private String subjectCode;
    private String subjectName;
    private String docType;
    private String description;
    private int pageCount;
    private Integer creditCost;
    private int viewCount;
    private int downloadCount;
    private double rating;
    private int reviewCount;

    private String authorName;
    private String authorAvatar;
    private String thumbnailUrl;
}