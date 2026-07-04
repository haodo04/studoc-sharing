package hcmuaf.edu.vn.backend.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SummaryResponseDTO {
    private String content;
    private String language;
}
