package hcmuaf.edu.vn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UniversityDTO {
    private String id;
    private String name;
    private String shortName;
    private String logoUrl;
    private boolean isFeatured;
}