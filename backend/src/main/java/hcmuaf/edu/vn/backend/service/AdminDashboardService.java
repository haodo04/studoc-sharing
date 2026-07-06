package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.CategoryDocument;
import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import hcmuaf.edu.vn.backend.document.PaymentTransaction;
import hcmuaf.edu.vn.backend.document.ProfileDocument;
import hcmuaf.edu.vn.backend.dto.admin.ChartData;
import hcmuaf.edu.vn.backend.dto.admin.DashboardStatsDTO;
import hcmuaf.edu.vn.backend.dto.admin.DocumentSummary;
import hcmuaf.edu.vn.backend.repository.CategoryRepository;
import hcmuaf.edu.vn.backend.repository.FileMetadataRepository;
import hcmuaf.edu.vn.backend.repository.PaymentTransactionRepository;
import hcmuaf.edu.vn.backend.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final ProfileRepository profileRepository;
    private final FileMetadataRepository fileMetadataRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final CategoryRepository categoryRepository;
    private final MongoTemplate mongoTemplate;

    public DashboardStatsDTO getDashboardStats() {
        long totalUsers = profileRepository.count();
        long totalDocuments = fileMetadataRepository.count();

        // Calculate total revenue
        List<PaymentTransaction> successfulTxns = paymentTransactionRepository.findAll().stream()
                .filter(t -> "00".equals(t.getStatus()))
                .collect(Collectors.toList());
        long totalRevenue = successfulTxns.stream().mapToLong(t -> t.getAmount() != null ? t.getAmount() : 0L).sum();

        // Recent Uploads
        List<FileMetadataDocument> recentDocs = fileMetadataRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "uploadedAt"))
        ).getContent();

        Map<String, String> categoryMap = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(CategoryDocument::getId, CategoryDocument::getName));

        List<DocumentSummary> recentUploads = recentDocs.stream().map(doc -> DocumentSummary.builder()
                .id(doc.getId())
                .title(doc.getTitle() != null ? doc.getTitle() : doc.getName())
                .uploaderId(doc.getClerkId())
                .categoryName(doc.getCategoryId() != null ? categoryMap.getOrDefault(doc.getCategoryId(), "Unknown") : "Unknown")
                .uploadedAt(doc.getUploadedAt())
                .build()
        ).collect(Collectors.toList());

        // Documents by Category
        Map<String, Long> docCountsByCatId = new HashMap<>();
        for (FileMetadataDocument doc : fileMetadataRepository.findAll()) {
            if (doc.getCategoryId() != null) {
                docCountsByCatId.put(doc.getCategoryId(), docCountsByCatId.getOrDefault(doc.getCategoryId(), 0L) + 1);
            }
        }
        
        List<ChartData> documentsByCategory = docCountsByCatId.entrySet().stream().map(entry -> {
            String catName = categoryMap.getOrDefault(entry.getKey(), "Unknown");
            return new ChartData(catName, entry.getValue());
        }).collect(Collectors.toList());

        // User Growth (Group by Year-Month)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy").withZone(ZoneId.systemDefault());
        Map<String, Long> userGrowthMap = new HashMap<>();
        for (ProfileDocument profile : profileRepository.findAll()) {
            if (profile.getCreatedAt() != null) {
                String monthYear = formatter.format(profile.getCreatedAt());
                userGrowthMap.put(monthYear, userGrowthMap.getOrDefault(monthYear, 0L) + 1);
            }
        }
        
        List<ChartData> userGrowth = userGrowthMap.entrySet().stream()
                .map(entry -> new ChartData(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        return DashboardStatsDTO.builder()
                .totalUsers(totalUsers)
                .totalDocuments(totalDocuments)
                .totalRevenue(totalRevenue)
                .recentUploads(recentUploads)
                .documentsByCategory(documentsByCategory)
                .userGrowth(userGrowth)
                .build();
    }
}
