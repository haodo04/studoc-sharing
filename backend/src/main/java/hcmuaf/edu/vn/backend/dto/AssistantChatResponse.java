package hcmuaf.edu.vn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data @Builder @AllArgsConstructor
public class AssistantChatResponse {
    private String reply;
    private List<DocumentCardDto> documents;
}