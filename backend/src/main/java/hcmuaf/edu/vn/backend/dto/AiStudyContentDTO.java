package hcmuaf.edu.vn.backend.dto;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AiStudyContentDTO {
    private String summary;
    private List<ConceptDTO> concepts;
    private List<FlashcardDTO> flashcards;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ConceptDTO {
        private String term;
        private String explanation;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class FlashcardDTO {
        private String question;
        private String answer;
    }
}