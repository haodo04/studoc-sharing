package hcmuaf.edu.vn.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class GeminiClientService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.base-url}")
    private String baseUrl;

    @Value("${gemini.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> generateJsonFromPdf(byte[] pdfBytes, String prompt, Map<String, Object> responseSchema) {
        String base64Pdf = Base64.getEncoder().encodeToString(pdfBytes);

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of(
                        "role", "user",
                        "parts", List.of(
                                Map.of("inline_data", Map.of("mime_type", "application/pdf", "data", base64Pdf)),
                                Map.of("text", prompt)
                        )
                )),
                "generationConfig", Map.of(
                        "response_mime_type", "application/json",
                        "response_schema", responseSchema,
                        "max_output_tokens", 8192,
                        "thinking_config", Map.of("thinking_budget", 0)
                )
        );

        return callGemini(body);
    }

    public String chat(byte[] pdfBytes, List<Map<String, Object>> historyContents, String newUserMessage) {
        List<Map<String, Object>> contents = new ArrayList<>();

        if (historyContents.isEmpty()) {
            if (pdfBytes == null) {
                throw new IllegalStateException("Thiếu dữ liệu PDF cho lượt chat đầu tiên.");
            }
            String base64Pdf = Base64.getEncoder().encodeToString(pdfBytes);
            contents.add(Map.of(
                    "role", "user",
                    "parts", List.of(
                            Map.of("inline_data", Map.of("mime_type", "application/pdf", "data", base64Pdf)),
                            Map.of("text", "Đây là tài liệu học tập. Từ giờ hãy trả lời các câu hỏi của tôi dựa trên nội dung tài liệu này, bằng tiếng Việt, ngắn gọn, dễ hiểu.")
                    )
            ));
        } else {
            contents.addAll(historyContents);
        }

        contents.add(Map.of(
                "role", "user",
                "parts", List.of(Map.of("text", newUserMessage))
        ));

        Map<String, Object> result = callGemini(Map.of("contents", contents));
        return extractText(result);
    }

    private Map<String, Object> callGemini(Map<String, Object> body) {
        String url = baseUrl + "/models/" + model + ":generateContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        int maxRetries = 3;
        long delayMs = 1000;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
                return response.getBody();
            } catch (org.springframework.web.client.HttpServerErrorException e) {
                boolean isOverloaded = e.getStatusCode().value() == 503
                        || (e.getResponseBodyAsString() != null && e.getResponseBodyAsString().contains("UNAVAILABLE"));

                if (isOverloaded && attempt < maxRetries) {
                    System.err.println(">>> [Gemini] Quá tải (lần " + attempt + "/" + maxRetries + "), thử lại sau " + delayMs + "ms...");
                    try {
                        Thread.sleep(delayMs);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                    }
                    delayMs *= 2;
                    continue;
                }
                throw new IllegalStateException("Gemini hiện đang quá tải, vui lòng thử lại sau ít phút.", e);
            }
        }
        throw new IllegalStateException("Gemini hiện đang quá tải, vui lòng thử lại sau ít phút.");
    }

    @SuppressWarnings("unchecked")
    public String extractText(Map<String, Object> geminiResponse) {
        if (geminiResponse == null) {
            throw new IllegalStateException("Gemini không trả về phản hồi.");
        }
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) geminiResponse.get("candidates");
        if (candidates == null || candidates.isEmpty()) {
            Object promptFeedback = geminiResponse.get("promptFeedback");
            throw new IllegalStateException("Gemini không trả về nội dung (có thể bị chặn bởi bộ lọc an toàn). Chi tiết: " + promptFeedback);
        }
        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
        if (content == null) {
            throw new IllegalStateException("Gemini dừng phản hồi sớm, finishReason=" + candidates.get(0).get("finishReason"));
        }
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        if (parts == null || parts.isEmpty()) {
            throw new IllegalStateException("Gemini trả về nội dung rỗng.");
        }
        return (String) parts.get(0).get("text");
    }

    public String generateText(byte[] pdfBytes, String prompt, double temperature) {
        String base64Pdf = Base64.getEncoder().encodeToString(pdfBytes);

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of(
                        "role", "user",
                        "parts", List.of(
                                Map.of("inline_data", Map.of("mime_type", "application/pdf", "data", base64Pdf)),
                                Map.of("text", prompt)
                        )
                )),
                "generationConfig", Map.of("temperature", temperature)
        );

        Map<String, Object> result = callGemini(body);
        return extractText(result);
    }
}