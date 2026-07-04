package hcmuaf.edu.vn.backend.dto.response;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ChatSessionDetailDTO {
    private String id;
    private String title;
    private List<ChatTurnDTO> messages;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ChatTurnDTO {
        private String role;
        private String content;
    }
}