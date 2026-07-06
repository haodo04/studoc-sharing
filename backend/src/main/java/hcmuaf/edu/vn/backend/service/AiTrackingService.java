package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.AiUsageLogDocument;
import hcmuaf.edu.vn.backend.repository.AiUsageLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiTrackingService {

    private final AiUsageLogRepository aiUsageLogRepository;

    public void logAction(String clerkId, String documentId, String actionType, String description) {
        AiUsageLogDocument log = AiUsageLogDocument.builder()
                .clerkId(clerkId)
                .documentId(documentId)
                .actionType(actionType)
                .description(description)
                .createdAt(LocalDateTime.now())
                .build();
        aiUsageLogRepository.save(log);
    }

    public Map<String, Object> getAiStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalRequests = aiUsageLogRepository.count();
        stats.put("totalRequests", totalRequests);

        long summaryRequests = aiUsageLogRepository.countByActionType("SUMMARY");
        long conceptsRequests = aiUsageLogRepository.countByActionType("CONCEPTS");
        long flashcardRequests = aiUsageLogRepository.countByActionType("FLASHCARD");
        long chatRequests = aiUsageLogRepository.countByActionType("CHAT");

        stats.put("summaryRequests", summaryRequests);
        stats.put("conceptsRequests", conceptsRequests);
        stats.put("flashcardRequests", flashcardRequests);
        stats.put("chatRequests", chatRequests);

        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        List<AiUsageLogDocument> todayLogs = aiUsageLogRepository.findByCreatedAtBetween(startOfDay, endOfDay);
        stats.put("requestsToday", todayLogs.size());

        return stats;
    }

    public Page<AiUsageLogDocument> getRecentLogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return aiUsageLogRepository.findAll(pageable);
    }
}
