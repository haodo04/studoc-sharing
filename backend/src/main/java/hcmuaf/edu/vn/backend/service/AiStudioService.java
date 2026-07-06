package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.*;
import hcmuaf.edu.vn.backend.dto.response.*;
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
    private final AiSummaryRepository aiSummaryRepository;
    private final AiConceptsRepository aiConceptsRepository;
    private final AiFlashcardSetRepository aiFlashcardSetRepository;
    private final AiChatSessionRepository aiChatSessionRepository;
    private final GeminiClientService geminiClientService;
<<<<<<< HEAD
    private final AiTrackingService aiTrackingService;
=======
    private final UserCreditsService userCreditsService;
>>>>>>> 856f059a08f085c679b0939fd1e236445c26c550
    private final RestTemplate restTemplate = new RestTemplate();

    private FileMetadataDocument requireUnlockedFile(String fileId, String clerkId) {
        FileMetadataDocument file = fileMetadataRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài liệu"));

        boolean allowed = clerkId.equals(file.getClerkId())
                || unlockHistoryRepository.existsByClerkIdAndFileId(clerkId, fileId);

        if (!allowed) {
            throw new SecurityException("Bạn cần mở khóa tài liệu bằng xu trước khi dùng Trợ lý AI!");
        }

        // Trợ lý AI (tóm tắt, khái niệm, flashcard, chat) là đặc quyền riêng của thành viên
        // Premium Năm còn hiệu lực, cộng thêm điều kiện đã mở khóa tài liệu ở trên.
        if (!userCreditsService.isPremiumYearActive(clerkId)) {
            throw new SecurityException(
                    "Trợ lý AI là đặc quyền dành riêng cho thành viên gói Premium Năm. " +
                            "Vui lòng nâng cấp gói tại trang Premium để sử dụng!");
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

    public SummaryResponseDTO getOrGenerateSummary(String fileId, String clerkId, String language, boolean regenerate) {
        FileMetadataDocument file = requireUnlockedFile(fileId, clerkId);
        String lang = normalizeLanguage(language);

        if (!regenerate) {
            Optional<AiSummaryDocument> cached = aiSummaryRepository.findByFileIdAndLanguage(fileId, lang);
            if (cached.isPresent()) {
                return toSummaryDTO(cached.get());
            }
        }

        byte[] pdfBytes = downloadPdfBytes(file);
        String prompt = buildSummaryPrompt(lang);
        String summaryText = geminiClientService.generateText(pdfBytes, prompt, regenerate ? 1.0 : 0.7);

        aiTrackingService.logAction(clerkId, fileId, "SUMMARY", "Generated " + lang + " summary");

        AiSummaryDocument doc = aiSummaryRepository.findByFileIdAndLanguage(fileId, lang)
                .map(existing -> {
                    existing.setContent(summaryText);
                    existing.setGeneratedAt(LocalDateTime.now());
                    return existing;
                })
                .orElseGet(() -> AiSummaryDocument.builder()
                        .fileId(fileId)
                        .language(lang)
                        .content(summaryText)
                        .generatedAt(LocalDateTime.now())
                        .build());

        try {
            aiSummaryRepository.save(doc);
        } catch (org.springframework.dao.DuplicateKeyException e) {
            return aiSummaryRepository.findByFileIdAndLanguage(fileId, lang)
                    .map(this::toSummaryDTO)
                    .orElseThrow(() -> e);
        }

        return toSummaryDTO(doc);
    }

    private String normalizeLanguage(String language) {
        return "en".equalsIgnoreCase(language) ? "en" : "vi";
    }

    private String buildSummaryPrompt(String lang) {
        if ("en".equals(lang)) {
            return """
                You are a study assistant. Read the attached PDF document and write a clear,
                well-structured summary in English (around 200-300 words), covering the main
                ideas and key points. Only return the summary text itself, no preamble.
                """;
        }
        return """
            Bạn là trợ lý học tập. Đọc tài liệu PDF đính kèm và viết một bản tóm tắt rõ ràng,
            mạch lạc bằng tiếng Việt (khoảng 200-300 từ), nêu bật các ý chính và điểm quan trọng.
            Chỉ trả về nội dung tóm tắt, không thêm lời dẫn hay giải thích nào khác.
            """;
    }

    private SummaryResponseDTO toSummaryDTO(AiSummaryDocument doc) {
        return SummaryResponseDTO.builder()
                .content(doc.getContent())
                .language(doc.getLanguage())
                .build();
    }

    public ConceptsResponseDTO getOrGenerateConcepts(String fileId, String clerkId) {
        FileMetadataDocument file = requireUnlockedFile(fileId, clerkId);

        return aiConceptsRepository.findByFileId(fileId)
                .map(this::toConceptsDTO)
                .orElseGet(() -> generateAndCacheConcepts(fileId, file));
    }

    private ConceptsResponseDTO generateAndCacheConcepts(String fileId, FileMetadataDocument file) {
        byte[] pdfBytes = downloadPdfBytes(file);

        Map<String, Object> schema = Map.of(
                "type", "OBJECT",
                "properties", Map.of(
                        "concepts", Map.of("type", "ARRAY", "items", Map.of(
                                "type", "OBJECT",
                                "properties", Map.of(
                                        "term", Map.of("type", "STRING", "maxLength", 100),
                                        "explanation", Map.of("type", "STRING", "maxLength", 300)
                                ),
                                "required", List.of("term", "explanation")
                        ))
                )
        );

        String prompt = """
            Bạn là trợ lý học tập. Đọc tài liệu PDF đính kèm và liệt kê 5-10 khái niệm/thuật ngữ
            quan trọng nhất xuất hiện trong tài liệu, kèm giải thích ngắn gọn, dễ hiểu bằng tiếng Việt.
            Chỉ trả JSON đúng schema, không thêm text nào khác.
            """;

        Map<String, Object> result = geminiClientService.generateJsonFromPdf(pdfBytes, prompt, schema);
        String json = geminiClientService.extractText(result);

        aiTrackingService.logAction(file.getClerkId(), fileId, "CONCEPTS", "Generated concepts");

        AiConceptsDocument doc = parseConceptsJson(json, fileId);

        try {
            aiConceptsRepository.save(doc);
        } catch (org.springframework.dao.DuplicateKeyException e) {
            return aiConceptsRepository.findByFileId(fileId)
                    .map(this::toConceptsDTO)
                    .orElseThrow(() -> e);
        }

        return toConceptsDTO(doc);
    }

    private AiConceptsDocument parseConceptsJson(String json, String fileId) {
        try {
            var mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            var node = mapper.readTree(json);

            List<AiConceptsDocument.ConceptItem> concepts = new ArrayList<>();
            if (node.has("concepts") && node.get("concepts").isArray()) {
                node.get("concepts").forEach(c -> concepts.add(
                        AiConceptsDocument.ConceptItem.builder()
                                .term(c.path("term").asText(""))
                                .explanation(c.path("explanation").asText(""))
                                .build()));
            }

            return AiConceptsDocument.builder()
                    .fileId(fileId)
                    .concepts(concepts)
                    .generatedAt(LocalDateTime.now())
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Không thể xử lý phản hồi khái niệm từ AI: " + e.getMessage(), e);
        }
    }

    private ConceptsResponseDTO toConceptsDTO(AiConceptsDocument doc) {
        return ConceptsResponseDTO.builder()
                .concepts(doc.getConcepts().stream()
                        .map(c -> new ConceptsResponseDTO.ConceptDTO(c.getTerm(), c.getExplanation()))
                        .toList())
                .build();
    }

    public List<FlashcardSetSummaryDTO> listFlashcardSets(String fileId, String clerkId) {
        requireUnlockedFile(fileId, clerkId);
        return aiFlashcardSetRepository.findByFileIdAndClerkIdOrderByCreatedAtDesc(fileId, clerkId).stream()
                .map(this::toSummaryDTO)
                .toList();
    }

    public FlashcardSetDetailDTO getFlashcardSetDetail(String fileId, String clerkId, String setId) {
        requireUnlockedFile(fileId, clerkId);
        AiFlashcardSetDocument set = findOwnedSet(fileId, clerkId, setId);
        return toDetailDTO(set);
    }

    public FlashcardSetDetailDTO generateFlashcardSet(String fileId, String clerkId, String language, int numCards) {
        FileMetadataDocument file = requireUnlockedFile(fileId, clerkId);
        String lang = normalizeLanguage(language);
        int count = Math.max(5, Math.min(numCards, 30)); // giới hạn an toàn

        AiFlashcardSetDocument set = AiFlashcardSetDocument.builder()
                .fileId(fileId)
                .clerkId(clerkId)
                .language(lang)
                .numCards(count)
                .createdAt(LocalDateTime.now())
                .build();

        try {
            byte[] pdfBytes = downloadPdfBytes(file);

            Map<String, Object> schema = Map.of(
                    "type", "OBJECT",
                    "properties", Map.of(
                            "flashcards", Map.of("type", "ARRAY", "items", Map.of(
                                    "type", "OBJECT",
                                    "properties", Map.of(
                                            "front", Map.of("type", "STRING", "maxLength", 150),
                                            "back", Map.of("type", "STRING", "maxLength", 300)
                                    ),
                                    "required", List.of("front", "back")
                            ))
                    )
            );

            Map<String, Object> result = geminiClientService.generateJsonFromPdf(
                    pdfBytes, buildFlashcardPrompt(lang, count), schema);
            String json = geminiClientService.extractText(result);

            set.setCards(parseFlashcardCards(json));
            set.setStatus("ready");

            aiTrackingService.logAction(clerkId, fileId, "FLASHCARD", "Generated " + count + " " + lang + " cards");
        } catch (Exception e) {
            set.setCards(new ArrayList<>());
            set.setStatus("error");
            set.setErrorMessage(e.getMessage());
        }

        aiFlashcardSetRepository.save(set);

        if ("error".equals(set.getStatus())) {
            throw new RuntimeException(set.getErrorMessage());
        }
        return toDetailDTO(set);
    }

    private String buildFlashcardPrompt(String lang, int count) {
        String langInstruction = "en".equals(lang) ? "in English" : "bằng tiếng Việt";
        return """
    Bạn là trợ lý học tập. Đọc tài liệu PDF đính kèm và tạo đúng %d flashcard dạng câu hỏi-đáp
    để ôn tập, %s.

    YÊU CẦU BẮT BUỘC cho mỗi flashcard:
    - "front": CHỈ hỏi về ĐÚNG MỘT khái niệm/công thức cụ thể, dưới 25 từ.
    - "back": ngắn gọn, tối đa 2-3 câu, dưới 60 từ.
    - TUYỆT ĐỐI KHÔNG được gộp nhiều câu hỏi con lại thành 1 "front" duy nhất,
      kể cả khi tài liệu gốc trình bày chúng liền nhau trong cùng 1 đoạn hay 1 dấu ngoặc.
    - Nếu 1 đoạn tài liệu chứa nhiều ý (ví dụ nhiều câu hỏi lồng trong ngoặc đơn),
      hãy TÁCH RIÊNG từng ý thành 1 flashcard độc lập, không được gộp.

    Ví dụ ĐÚNG:
    {"front": "Mô hình Client-Server dùng công nghệ gì cho Frontend?", "back": "ReactJS."}
    {"front": "Vai trò của mô hình Client-Server là gì?", "back": "Tách biệt Frontend và Backend, đảm bảo tính tường minh và an toàn dữ liệu."}

    Ví dụ SAI (không được làm như này — gộp nhiều câu hỏi vào 1 front):
    {"front": "Mô hình là gì, dùng công nghệ nào, có vai trò gì, áp dụng kiến trúc nào...", "back": ""}

    Chỉ trả JSON đúng schema, không thêm text nào khác.
    """.formatted(count, langInstruction);
    }

    private List<AiFlashcardSetDocument.CardItem> parseFlashcardCards(String json) {
        try {
            var mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            var node = mapper.readTree(json);
            List<AiFlashcardSetDocument.CardItem> cards = new ArrayList<>();
            if (node.has("flashcards") && node.get("flashcards").isArray()) {
                node.get("flashcards").forEach(f -> {
                    String front = f.path("front").asText("").trim();
                    String back = f.path("back").asText("").trim();

                    if (front.isEmpty() || back.isEmpty() || front.length() > 200) {
                        System.err.println(">>> [Flashcard] Bỏ qua thẻ lỗi/gộp: " + front);
                        return;
                    }

                    cards.add(AiFlashcardSetDocument.CardItem.builder()
                            .id(java.util.UUID.randomUUID().toString())
                            .front(front)
                            .back(back)
                            .known(false)
                            .build());
                });
            }
            return cards;
        } catch (Exception e) {
            throw new RuntimeException("Không thể xử lý phản hồi flashcard từ AI: " + e.getMessage(), e);
        }
    }

    public FlashcardSetDetailDTO markCardKnown(String fileId, String clerkId, String setId, String cardId, boolean known) {
        requireUnlockedFile(fileId, clerkId);
        AiFlashcardSetDocument set = findOwnedSet(fileId, clerkId, setId);

        set.getCards().stream()
                .filter(c -> c.getId().equals(cardId))
                .findFirst()
                .ifPresent(c -> c.setKnown(known));

        aiFlashcardSetRepository.save(set);
        return toDetailDTO(set);
    }

    public void resetFlashcardSetProgress(String fileId, String clerkId, String setId) {
        requireUnlockedFile(fileId, clerkId);
        AiFlashcardSetDocument set = findOwnedSet(fileId, clerkId, setId);
        set.getCards().forEach(c -> c.setKnown(false));
        aiFlashcardSetRepository.save(set);
    }

    public void deleteFlashcardSet(String fileId, String clerkId, String setId) {
        requireUnlockedFile(fileId, clerkId);
        aiFlashcardSetRepository.delete(findOwnedSet(fileId, clerkId, setId));
    }

    private AiFlashcardSetDocument findOwnedSet(String fileId, String clerkId, String setId) {
        AiFlashcardSetDocument set = aiFlashcardSetRepository.findByIdAndClerkId(setId, clerkId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bộ flashcard"));
        if (!set.getFileId().equals(fileId)) {
            throw new SecurityException("Bộ flashcard không thuộc tài liệu này.");
        }
        return set;
    }

    private FlashcardSetSummaryDTO toSummaryDTO(AiFlashcardSetDocument set) {
        int known = set.getCards() == null ? 0 :
                (int) set.getCards().stream().filter(AiFlashcardSetDocument.CardItem::isKnown).count();
        return FlashcardSetSummaryDTO.builder()
                .id(set.getId())
                .numCards(set.getCards() == null ? set.getNumCards() : set.getCards().size())
                .language(set.getLanguage())
                .status(set.getStatus())
                .errorMessage(set.getErrorMessage())
                .createdAt(set.getCreatedAt())
                .knownCount(known)
                .build();
    }

    private FlashcardSetDetailDTO toDetailDTO(AiFlashcardSetDocument set) {
        return FlashcardSetDetailDTO.builder()
                .id(set.getId())
                .language(set.getLanguage())
                .status(set.getStatus())
                .createdAt(set.getCreatedAt())
                .cards(set.getCards() == null ? List.of() : set.getCards().stream()
                        .map(c -> new FlashcardSetDetailDTO.CardDTO(c.getId(), c.getFront(), c.getBack(), c.isKnown()))
                        .toList())
                .build();
    }

    public List<ChatSessionSummaryDTO> listChatSessions(String fileId, String clerkId) {
        requireUnlockedFile(fileId, clerkId);
        return aiChatSessionRepository.findByFileIdAndClerkIdOrderByUpdatedAtDesc(fileId, clerkId).stream()
                .map(this::toChatSummaryDTO)
                .toList();
    }

    public ChatSessionDetailDTO createChatSession(String fileId, String clerkId) {
        requireUnlockedFile(fileId, clerkId);
        AiChatSessionDocument session = AiChatSessionDocument.builder()
                .fileId(fileId)
                .clerkId(clerkId)
                .title("Cuộc trò chuyện mới")
                .messages(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        aiChatSessionRepository.save(session);
        return toChatDetailDTO(session);
    }

    public ChatSessionDetailDTO getChatSessionDetail(String fileId, String clerkId, String sessionId) {
        requireUnlockedFile(fileId, clerkId);
        return toChatDetailDTO(findOwnedSession(fileId, clerkId, sessionId));
    }

    public void deleteChatSession(String fileId, String clerkId, String sessionId) {
        requireUnlockedFile(fileId, clerkId);
        aiChatSessionRepository.delete(findOwnedSession(fileId, clerkId, sessionId));
    }

    public ChatSessionDetailDTO sendMessage(String fileId, String clerkId, String sessionId, String userMessage) {
        FileMetadataDocument file = requireUnlockedFile(fileId, clerkId);
        AiChatSessionDocument session = findOwnedSession(fileId, clerkId, sessionId);

        boolean isFirstMessage = session.getMessages().isEmpty();
        byte[] pdfBytes = isFirstMessage ? downloadPdfBytes(file) : null;

        List<Map<String, Object>> historyContents = session.getMessages().stream()
                .map(m -> (Map<String, Object>) Map.<String, Object>of(
                        "role", m.getRole().equals("user") ? "user" : "model",
                        "parts", List.of(Map.of("text", m.getContent()))))
                .toList();

        String reply = geminiClientService.chat(pdfBytes, historyContents, userMessage);

        aiTrackingService.logAction(clerkId, fileId, "CHAT", "User sent a message");

        session.getMessages().add(AiChatSessionDocument.ChatTurn.builder()
                .role("user").content(userMessage).timestamp(LocalDateTime.now()).build());
        session.getMessages().add(AiChatSessionDocument.ChatTurn.builder()
                .role("model").content(reply).timestamp(LocalDateTime.now()).build());

        if (isFirstMessage) {
            session.setTitle(buildAutoTitle(userMessage));
        }
        session.setUpdatedAt(LocalDateTime.now());
        aiChatSessionRepository.save(session);

        return toChatDetailDTO(session);
    }

    private String buildAutoTitle(String firstMessage) {
        String trimmed = firstMessage.trim().replaceAll("\\s+", " ");
        return trimmed.length() > 40 ? trimmed.substring(0, 40) + "..." : trimmed;
    }

    private AiChatSessionDocument findOwnedSession(String fileId, String clerkId, String sessionId) {
        AiChatSessionDocument session = aiChatSessionRepository.findByIdAndClerkId(sessionId, clerkId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cuộc trò chuyện"));
        if (!session.getFileId().equals(fileId)) {
            throw new SecurityException("Cuộc trò chuyện không thuộc tài liệu này.");
        }
        return session;
    }

    private ChatSessionSummaryDTO toChatSummaryDTO(AiChatSessionDocument s) {
        return ChatSessionSummaryDTO.builder()
                .id(s.getId())
                .title(s.getTitle())
                .updatedAt(s.getUpdatedAt())
                .messageCount(s.getMessages() == null ? 0 : s.getMessages().size())
                .build();
    }

    private ChatSessionDetailDTO toChatDetailDTO(AiChatSessionDocument s) {
        return ChatSessionDetailDTO.builder()
                .id(s.getId())
                .title(s.getTitle())
                .messages(s.getMessages() == null ? List.of() : s.getMessages().stream()
                        .map(m -> new ChatSessionDetailDTO.ChatTurnDTO(m.getRole(), m.getContent()))
                        .toList())
                .build();
    }
}