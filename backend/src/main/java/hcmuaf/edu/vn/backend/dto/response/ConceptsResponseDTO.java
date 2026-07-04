package hcmuaf.edu.vn.backend.dto.response;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ConceptsResponseDTO {
    private List<ConceptDTO> concepts;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ConceptDTO {
        private String term;
        private String explanation;
    }
}
