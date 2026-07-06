package hcmuaf.edu.vn.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class AssistantChatRequest {
    private List<ChatTurn> history;
    private String message;

    @Data
    public static class ChatTurn {
        private String role;
        private String text;
    }
}