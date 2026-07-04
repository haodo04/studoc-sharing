package hcmuaf.edu.vn.backend.dto.request;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class GenerateFlashcardSetRequestDTO {
    private String language;
    private int numCards;
}