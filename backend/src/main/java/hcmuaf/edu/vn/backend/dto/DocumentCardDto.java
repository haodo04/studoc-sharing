package hcmuaf.edu.vn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data @Builder @AllArgsConstructor
public class DocumentCardDto {
    private String id;
    private String title;
    private String thumbnailUrl;
    private Integer creditCost;
    private String subjectName;
}