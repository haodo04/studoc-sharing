package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.*;
import hcmuaf.edu.vn.backend.dto.*;
import hcmuaf.edu.vn.backend.dto.response.ChatResponseDTO;
import hcmuaf.edu.vn.backend.exceptions.ResourceNotFoundException;
import hcmuaf.edu.vn.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AiStudioService {

    private final FileMetadataRepository fileMetadataRepository;
    private final UnlockHistoryRepository unlockHistoryRepository;
    private final AiStudyContentRepository aiStudyContentRepository;
    private final AiChatSessionRepository aiChatSessionRepository;
    private final GeminiClientService geminiClientService;
    private final RestTemplate restTemplate = new RestTemplate();

    private FileMetadataDocument requireUnlockedFile(String fileId, String clerkId) {
        FileMetadataDocument file = fileMetadataRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài liệu"));

        boolean allowed = clerkId.equals(file.getClerkId())
                || unlockHistoryRepository.existsByClerkIdAndFileId(clerkId, fileId);

        if (!allowed) {
            throw new SecurityException("Bạn cần mở khóa tài liệu bằng xu trước khi dùng Trợ lý AI!");
        }
        return file;
    }

    private byte[] downloadPdfBytes(FileMetadataDocument file) {
        String aiReferenceDocumentUrl = (file.getViewableUrl() != null && !file.getViewableUrl().isBlank())
                ? file.getViewableUrl()
                : file.getFileLocation();

        if (aiReferenceDocumentUrl == null || aiReferenceDocumentUrl.isBlank()) {
            throw new IllegalStateException("Không tìm thấy phiên bản PDF hợp lệ để AI có thể đọc tài liệu này.");
        }

        System.out.println(">>> [AI Studio] Đang tải tài liệu tham chiếu AI từ: " + aiReferenceDocumentUrl);

        byte[] bytes = restTemplate.getForObject(aiReferenceDocumentUrl, byte[].class);

        if (bytes == null || bytes.length == 0) {
            throw new IllegalStateException("Không tải được dữ liệu tài liệu từ URL: " + aiReferenceDocumentUrl);
        }

        System.out.println(">>> [AI Studio] Kích thước file tải về: " + bytes.length + " bytes");

        boolean looksLikePdf = bytes.length > 4
                && bytes[0] == '%' && bytes[1] == 'P' && bytes[2] == 'D' && bytes[3] == 'F';

        if (!looksLikePdf) {
            String preview = new String(bytes, 0, Math.min(bytes.length, 300));
            System.err.println(">>> [AI Studio] File tải về không phải PDF hợp lệ! Nội dung đầu nhận được: " + preview);
            throw new IllegalStateException(
                    "Tài liệu dùng cho AI không trả về file PDF hợp lệ. Hãy kiểm tra lại cấu hình phân quyền " +
                            "hoặc định dạng file gốc trên Cloudinary. URL: " + aiReferenceDocumentUrl
            );
        }

        return bytes;
    }

    public AiStudyContentDTO getOrGenerateStudyContent(String fileId, String clerkId) {
        FileMetadataDocument file = requireUnlockedFile(fileId, clerkId);

        return aiStudyContentRepository.findByFileId(fileId)
                .map(this::toDTO)
                .orElseGet(() -> generateAndCacheStudyContent(fileId, file));
    }

    private AiStudyContentDTO generateAndCacheStudyContent(String fileId, FileMetadataDocument file) {
        byte[] pdfBytes = downloadPdfBytes(file);

        Map<String, Object> schema = Map.of(
                "type", "OBJECT",
                "properties", Map.of(
                        "summary", Map.of("type", "STRING"),
                        "concepts", Map.of("type", "ARRAY", "items", Map.of(
                                "type", "OBJECT",
                                "properties", Map.of(
                                        "term", Map.of("type", "STRING"),
                                        "explanation", Map.of("type", "STRING")
                                )
                        )),
                        "flashcards", Map.of("type", "ARRAY", "items", Map.of(
                                "type", "OBJECT",
                                "properties", Map.of(
                                        "question", Map.of("type", "STRING"),
                                        "answer", Map.of("type", "STRING")
                                )
                        ))
                )
        );

        String prompt = """
        Bạn là trợ lý học tập. Đọc tài liệu PDF đính kèm và trả về bằng tiếng Việt:
        1. summary: tóm tắt nội dung chính (khoảng 200-300 từ, dạng markdown).
        2. concepts: 5-10 khái niệm/thuật ngữ quan trọng nhất kèm giải thích ngắn gọn.
        3. flashcards: 8-12 câu hỏi-đáp để ôn tập, bám sát nội dung tài liệu.
        Chỉ trả JSON đúng schema, không thêm text nào khác.
        """;

        Map<String, Object> result = geminiClientService.generateJsonFromPdf(pdfBytes, prompt, schema);
        String jsonText = geminiClientService.extractText(result);

        AiStudyContentDocument parsed = parseStudyContentJson(jsonText, fileId);

        try {
            aiStudyContentRepository.save(parsed);
        } catch (org.springframework.dao.DuplicateKeyException e) {
            return aiStudyContentRepository.findByFileId(fileId)
                    .map(this::toDTO)
                    .orElseThrow(() -> e);
        }

        return toDTO(parsed);
    }

    private AiStudyContentDocument parseStudyContentJson(String json, String fileId) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            var node = mapper.readTree(json);

            List<AiStudyContentDocument.ConceptItem> concepts = new ArrayList<>();
            node.get("concepts").forEach(c -> concepts.add(
                    AiStudyContentDocument.ConceptItem.builder()
                            .term(c.get("term").asText())
                            .explanation(c.get("explanation").asText())
                            .build()));

            List<AiStudyContentDocument.FlashcardItem> flashcards = new ArrayList<>();
            node.get("flashcards").forEach(f -> flashcards.add(
                    AiStudyContentDocument.FlashcardItem.builder()
                            .question(f.get("question").asText())
                            .answer(f.get("answer").asText())
                            .build()));

            return AiStudyContentDocument.builder()
                    .fileId(fileId)
                    .summary(node.get("summary").asText())
                    .concepts(concepts)
                    .flashcards(flashcards)
                    .generatedAt(LocalDateTime.now())
                    .modelUsed("gemini-2.5-flash")
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Không thể xử lý phản hồi từ AI: " + e.getMessage(), e);
        }
    }

    private AiStudyContentDTO toDTO(AiStudyContentDocument doc) {
        return AiStudyContentDTO.builder()
                .summary(doc.getSummary())
                .concepts(doc.getConcepts().stream()
                        .map(c -> new AiStudyContentDTO.ConceptDTO(c.getTerm(), c.getExplanation()))
                        .toList())
                .flashcards(doc.getFlashcards().stream()
                        .map(f -> new AiStudyContentDTO.FlashcardDTO(f.getQuestion(), f.getAnswer()))
                        .toList())
                .build();
    }

    public ChatResponseDTO chatWithDocument(String fileId, String clerkId, String userMessage) {
        FileMetadataDocument file = requireUnlockedFile(fileId, clerkId);
        byte[] pdfBytes = downloadPdfBytes(file);

        AiChatSessionDocument session = aiChatSessionRepository.findByFileIdAndClerkId(fileId, clerkId)
                .orElseGet(() -> AiChatSessionDocument.builder()
                        .fileId(fileId).clerkId(clerkId)
                        .messages(new ArrayList<>())
                        .build());

        List<Map<String, Object>> historyContents = session.getMessages().stream()
                .map(m -> (Map<String, Object>) Map.<String, Object>of(
                        "role", m.getRole().equals("user") ? "user" : "model",
                        "parts", List.of(Map.of("text", m.getContent()))))
                .toList();

        String reply = geminiClientService.chat(pdfBytes, historyContents, userMessage);

        session.getMessages().add(AiChatSessionDocument.ChatTurn.builder()
                .role("user").content(userMessage).timestamp(LocalDateTime.now()).build());
        session.getMessages().add(AiChatSessionDocument.ChatTurn.builder()
                .role("model").content(reply).timestamp(LocalDateTime.now()).build());
        session.setUpdatedAt(LocalDateTime.now());
        aiChatSessionRepository.save(session);

        return ChatResponseDTO.builder()
                .reply(reply)
                .history(session.getMessages().stream()
                        .map(m -> new ChatResponseDTO.ChatTurnDTO(m.getRole(), m.getContent()))
                        .toList())
                .build();
    }
}