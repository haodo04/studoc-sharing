package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.AssistantChatSessionDocument;
import hcmuaf.edu.vn.backend.document.AssistantChatSessionDocument.DocumentCardSnapshot;
import hcmuaf.edu.vn.backend.document.AssistantChatSessionDocument.Turn;
import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import hcmuaf.edu.vn.backend.repository.AssistantChatSessionRepository;
import hcmuaf.edu.vn.backend.repository.FileMetadataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SiteAssistantService {

    private final GeminiClientService geminiClientService;
    private final FileMetadataRepository fileMetadataRepository;
    private final AssistantChatSessionRepository sessionRepository;

    private static final String SYSTEM_PROMPT = """
        Bạn là trợ lý AI của StudocShare - website chia sẻ tài liệu học tập cho sinh viên Việt Nam.
        Quy tắc website (dùng để trả lời câu hỏi về cách hoạt động):
        - Người dùng upload tài liệu được cộng 2 xu.
        - Người khác muốn xem/tải tài liệu phải trả xu (do người upload tự đặt giá) để "mở khóa".
        - Xu có thể nạp qua trang Premium (mua gói xu hoặc gói Premium tháng/năm).
        - Có mục "Hỏi đáp" dưới mỗi tài liệu để bình luận/trả lời lồng nhau.
        - Có "Cộng đồng" là sảnh chat theo phòng (chung, theo ngành, theo trường) để chia sẻ tài liệu qua card.
        - Mỗi tài liệu có "AI Studio" riêng (tab Trò chuyện) để chat sâu về đúng nội dung tài liệu đó,
          khác với bạn - bạn chỉ tìm kiếm tài liệu và trả lời câu hỏi chung về website.
        Khi người dùng hỏi tìm tài liệu, dùng hàm search_documents để tìm rồi trả lời dựa trên kết quả thật,
        TUYỆT ĐỐI không tự bịa ra tên tài liệu không có trong kết quả tìm kiếm.
        Trả lời ngắn gọn, thân thiện, bằng tiếng Việt.
        """;

    private static final int MAX_PREVIOUS_MESSAGES_AS_CONTEXT = 2;

    public List<AssistantChatSessionDocument> listSessions(String ownerKey) {
        return sessionRepository.findByOwnerKeyOrderByUpdatedAtDesc(ownerKey);
    }

    public AssistantChatSessionDocument createSession(String ownerKey) {
        AssistantChatSessionDocument session = AssistantChatSessionDocument.builder()
                .ownerKey(ownerKey)
                .title("Cuộc trò chuyện mới")
                .messages(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return sessionRepository.save(session);
    }

    public AssistantChatSessionDocument getSessionDetail(String sessionId, String ownerKey) {
        return getOwnedOrThrow(sessionId, ownerKey);
    }

    public void deleteSession(String sessionId, String ownerKey) {
        AssistantChatSessionDocument session = getOwnedOrThrow(sessionId, ownerKey);
        sessionRepository.delete(session);
    }

    public AssistantChatSessionDocument sendMessage(String sessionId, String ownerKey, String userMessage) {
        AssistantChatSessionDocument session = getOwnedOrThrow(sessionId, ownerKey);

        session.getMessages().add(Turn.builder().role("user").content(userMessage).build());

        List<Map<String, Object>> contents = toGeminiContents(recentContext(session.getMessages()));
        List<Map<String, Object>> tools = buildTools();

        Map<String, Object> firstResult = geminiClientService.generateWithTools(contents, tools, SYSTEM_PROMPT);
        Map<String, Object> firstPart = extractFirstPart(firstResult);

        if (firstPart.containsKey("functionCall")) {
            appendFunctionCallTurn(session, contents, tools, firstPart);
        } else {
            String text = geminiClientService.extractText(firstResult);
            session.getMessages().add(Turn.builder().role("model").content(text).build());
        }

        if ("Cuộc trò chuyện mới".equals(session.getTitle()) && session.getMessages().size() >= 1) {
            String firstUserMsg = session.getMessages().get(0).getContent();
            session.setTitle(firstUserMsg.length() > 40 ? firstUserMsg.substring(0, 40) + "..." : firstUserMsg);
        }

        session.setUpdatedAt(LocalDateTime.now());
        return sessionRepository.save(session);
    }

    @SuppressWarnings("unchecked")
    private void appendFunctionCallTurn(AssistantChatSessionDocument session,
                                        List<Map<String, Object>> contents,
                                        List<Map<String, Object>> tools,
                                        Map<String, Object> functionCallPart) {
        Map<String, Object> functionCall = (Map<String, Object>) functionCallPart.get("functionCall");
        String functionName = (String) functionCall.get("name");

        if (!"search_documents".equals(functionName)) {
            session.getMessages().add(Turn.builder().role("model").content("Xin lỗi, mình chưa hỗ trợ thao tác này.").build());
            return;
        }

        Map<String, Object> args = (Map<String, Object>) functionCall.get("args");
        String keyword = (args != null && args.get("keyword") != null) ? args.get("keyword").toString() : "";
        List<FileMetadataDocument> results = searchDocuments(keyword);

        contents.add(Map.of("role", "model", "parts", List.of(functionCallPart)));
        Map<String, Object> functionResponsePart = Map.of(
                "functionResponse", Map.of(
                        "name", "search_documents",
                        "response", Map.of("results", toSummaryForAI(results))
                )
        );
        contents.add(Map.of("role", "user", "parts", List.of(functionResponsePart)));

        String finalText;
        try {
            Map<String, Object> secondResult = geminiClientService.generateWithTools(contents, null, SYSTEM_PROMPT);
            finalText = geminiClientService.extractText(secondResult);
        } catch (Exception e) {
            System.err.println(">>> [Gemini] Lượt tổng hợp sau tool-call thất bại, dùng câu trả lời mặc định: " + e.getMessage());
            finalText = null;
        }
        if (finalText == null || finalText.isBlank()) {
            finalText = results.isEmpty()
                    ? "Mình không tìm thấy tài liệu phù hợp với từ khóa \"" + keyword + "\"."
                    : "Mình tìm thấy vài tài liệu có thể phù hợp, bạn xem thử nhé:";
        }

        session.getMessages().add(Turn.builder()
                .role("model")
                .content(finalText)
                .documents(toSnapshot(results))
                .build());
    }

    private AssistantChatSessionDocument getOwnedOrThrow(String sessionId, String ownerKey) {
        AssistantChatSessionDocument session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Cuộc trò chuyện không tồn tại"));
        if (!session.getOwnerKey().equals(ownerKey)) {
            throw new SecurityException("Bạn không có quyền với cuộc trò chuyện này");
        }
        return session;
    }

    /**
     * Cắt bớt lịch sử: chỉ giữ lại MAX_PREVIOUS_MESSAGES_AS_CONTEXT tin nhắn trước đó
     * cộng với tin nhắn mới nhất (vừa được thêm vào), thay vì gửi toàn bộ session lên
     * Gemini mỗi lần. Cuộc trò chuyện càng dài mà vẫn gửi full lịch sử thì token quota
     * sẽ bị tốn theo cấp số cộng dù người dùng chỉ hỏi 1 câu ngắn.
     */
    private List<Turn> recentContext(List<Turn> allMessages) {
        int total = allMessages.size();
        int keep = MAX_PREVIOUS_MESSAGES_AS_CONTEXT + 1; // +1 cho tin nhắn mới nhất
        if (total <= keep) {
            return allMessages;
        }
        return allMessages.subList(total - keep, total);
    }

    private List<Map<String, Object>> toGeminiContents(List<Turn> turns) {
        List<Map<String, Object>> contents = new ArrayList<>();
        for (Turn t : turns) {
            contents.add(Map.of("role", t.getRole(), "parts", List.of(Map.of("text", t.getContent()))));
        }
        return contents;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> extractFirstPart(Map<String, Object> geminiResponse) {
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) geminiResponse.get("candidates");
        if (candidates == null || candidates.isEmpty()) {
            throw new IllegalStateException("Gemini không trả về nội dung.");
        }
        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        return parts.get(0);
    }

    private List<FileMetadataDocument> searchDocuments(String keyword) {
        return fileMetadataRepository.findByTitleContainingIgnoreCaseAndIsPublicTrue(keyword)
                .stream().limit(5).toList();
    }

    private List<Map<String, Object>> toSummaryForAI(List<FileMetadataDocument> docs) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (FileMetadataDocument d : docs) {
            Map<String, Object> item = new HashMap<>();
            item.put("title", d.getTitle());
            item.put("subject", d.getSubjectName() == null ? "" : d.getSubjectName());
            item.put("creditCost", d.getCreditCost() == null ? 0 : d.getCreditCost());
            result.add(item);
        }
        return result;
    }

    private List<DocumentCardSnapshot> toSnapshot(List<FileMetadataDocument> docs) {
        return docs.stream().map(d -> DocumentCardSnapshot.builder()
                .id(d.getId())
                .title(d.getTitle())
                .thumbnailUrl(d.getThumbnailUrl())
                .creditCost(d.getCreditCost())
                .subjectName(d.getSubjectName())
                .build()).toList();
    }

    private List<Map<String, Object>> buildTools() {
        return List.of(Map.of(
                "functionDeclarations", List.of(Map.of(
                        "name", "search_documents",
                        "description", "Tìm kiếm tài liệu trên StudocShare theo từ khóa",
                        "parameters", Map.of(
                                "type", "OBJECT",
                                "properties", Map.of(
                                        "keyword", Map.of("type", "STRING", "description", "Từ khóa tìm kiếm")
                                ),
                                "required", List.of("keyword")
                        )
                ))
        ));
    }
}