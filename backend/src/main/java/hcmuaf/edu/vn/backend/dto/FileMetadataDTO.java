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
public class FileMetadataDTO {

    private String id;
    private String name;
    private String title;
    private String type;
    private Long size;
    private String clerkId;
    private Boolean isPublic;
    private String fileLocation;
    private LocalDateTime uploadedAt;

    private String universityId;
    private String subjectCode;
    private String subjectName;
    private String categoryId;
    private String customUniversity;
    private String customCategory;
    private String docType;
    private String description;
    private Integer pageCount;
    private Integer creditCost;

    private Integer viewCount;
    private Integer downloadCount;
    private Double rating;
    private Integer reviewCount;
    private String thumbnailUrl;
}