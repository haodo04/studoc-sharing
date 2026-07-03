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
                        "response_schema", responseSchema
                )
        );

        return callGemini(body);
    }

    public String chat(byte[] pdfBytes, List<Map<String, Object>> historyContents, String newUserMessage) {
        String base64Pdf = Base64.getEncoder().encodeToString(pdfBytes);

        List<Map<String, Object>> contents = new ArrayList<>();

        if (historyContents.isEmpty()) {
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

    @SuppressWarnings("unchecked")
    private Map<String, Object> callGemini(Map<String, Object> body) {
        String url = baseUrl + "/models/" + model + ":generateContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
        return response.getBody();
    }

    @SuppressWarnings("unchecked")
    public String extractText(Map<String, Object> geminiResponse) {
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) geminiResponse.get("candidates");
        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        return (String) parts.get(0).get("text");
    }
}