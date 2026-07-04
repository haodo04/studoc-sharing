package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.dto.request.ChatRequestDTO;
import hcmuaf.edu.vn.backend.dto.request.GenerateFlashcardSetRequestDTO;
import hcmuaf.edu.vn.backend.dto.request.MarkCardKnownRequestDTO;
import hcmuaf.edu.vn.backend.service.AiStudioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/files/{id}/ai-studio")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AiStudioController {

    private final AiStudioService aiStudioService;

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(
            @PathVariable String id,
            @RequestParam(defaultValue = "vi") String lang,
            @RequestParam(defaultValue = "false") boolean regenerate,
            Principal principal
    ) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            return ResponseEntity.ok(aiStudioService.getOrGenerateSummary(id, principal.getName(), lang, regenerate));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/concepts")
    public ResponseEntity<?> getConcepts(@PathVariable String id, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            return ResponseEntity.ok(aiStudioService.getOrGenerateConcepts(id, principal.getName()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/flashcards/sets")
    public ResponseEntity<?> listFlashcardSets(@PathVariable String id, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            return ResponseEntity.ok(aiStudioService.listFlashcardSets(id, principal.getName()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/flashcards/sets/{setId}")
    public ResponseEntity<?> getFlashcardSet(@PathVariable String id, @PathVariable String setId, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            return ResponseEntity.ok(aiStudioService.getFlashcardSetDetail(id, principal.getName(), setId));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/flashcards/generate")
    public ResponseEntity<?> generateFlashcardSet(
            @PathVariable String id,
            @RequestBody GenerateFlashcardSetRequestDTO req,
            Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            return ResponseEntity.ok(
                    aiStudioService.generateFlashcardSet(id, principal.getName(), req.getLanguage(), req.getNumCards()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/flashcards/sets/{setId}/cards/{cardId}")
    public ResponseEntity<?> markCardKnown(
            @PathVariable String id, @PathVariable String setId, @PathVariable String cardId,
            @RequestBody MarkCardKnownRequestDTO req, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            return ResponseEntity.ok(
                    aiStudioService.markCardKnown(id, principal.getName(), setId, cardId, req.isKnown()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/flashcards/sets/{setId}/reset")
    public ResponseEntity<?> resetProgress(@PathVariable String id, @PathVariable String setId, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            aiStudioService.resetFlashcardSetProgress(id, principal.getName(), setId);
            return ResponseEntity.ok(Map.of("message", "Đã đặt lại tiến độ"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/flashcards/sets/{setId}")
    public ResponseEntity<?> deleteFlashcardSet(@PathVariable String id, @PathVariable String setId, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            aiStudioService.deleteFlashcardSet(id, principal.getName(), setId);
            return ResponseEntity.ok(Map.of("message", "Đã xoá bộ flashcard"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/chat/sessions")
    public ResponseEntity<?> listChatSessions(@PathVariable String id, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            return ResponseEntity.ok(aiStudioService.listChatSessions(id, principal.getName()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/chat/sessions")
    public ResponseEntity<?> createChatSession(@PathVariable String id, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            return ResponseEntity.ok(aiStudioService.createChatSession(id, principal.getName()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/chat/sessions/{sessionId}")
    public ResponseEntity<?> getChatSession(@PathVariable String id, @PathVariable String sessionId, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            return ResponseEntity.ok(aiStudioService.getChatSessionDetail(id, principal.getName(), sessionId));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/chat/sessions/{sessionId}/messages")
    public ResponseEntity<?> sendMessage(
            @PathVariable String id, @PathVariable String sessionId,
            @RequestBody ChatRequestDTO req, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            return ResponseEntity.ok(aiStudioService.sendMessage(id, principal.getName(), sessionId, req.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/chat/sessions/{sessionId}")
    public ResponseEntity<?> deleteChatSession(@PathVariable String id, @PathVariable String sessionId, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            aiStudioService.deleteChatSession(id, principal.getName(), sessionId);
            return ResponseEntity.ok(Map.of("message", "Đã xoá cuộc trò chuyện"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }
}