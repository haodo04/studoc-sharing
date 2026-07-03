package hcmuaf.edu.vn.backend.dto.response;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ChatResponseDTO {
    private String reply;
    private List<ChatTurnDTO> history;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ChatTurnDTO {
        private String role;
        private String content;
    }
}