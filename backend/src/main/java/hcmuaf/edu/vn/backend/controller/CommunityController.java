package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.document.ChatMessageDocument;
import hcmuaf.edu.vn.backend.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class CommunityController {

    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/community/messages")
    public ResponseEntity<List<ChatMessageDocument>> getHistory(
            @RequestParam(defaultValue = "general") String roomId,
            @RequestParam(defaultValue = "50") int limit) {
        List<ChatMessageDocument> messages = chatMessageRepository
                .findByRoomIdOrderByCreatedAtDesc(roomId, PageRequest.of(0, limit));
        Collections.reverse(messages);
        return ResponseEntity.ok(messages);
    }

    @MessageMapping("/community.send")
    public void sendMessage(ChatMessageDocument incoming, Principal principal) {
        String roomId = (incoming.getRoomId() == null || incoming.getRoomId().isBlank())
                ? "general" : incoming.getRoomId();

        ChatMessageDocument toSave = ChatMessageDocument.builder()
                .roomId(roomId)
                .type(incoming.getType())
                .content(incoming.getContent())
                .sharedFileId(incoming.getSharedFileId())
                .senderClerkId(principal.getName())
                .senderFullName(incoming.getSenderFullName())
                .senderPhotoUrl(incoming.getSenderPhotoUrl())
                .createdAt(LocalDateTime.now())
                .build();

        ChatMessageDocument saved = chatMessageRepository.save(toSave);

        messagingTemplate.convertAndSend("/topic/community." + roomId, saved);
    }
}