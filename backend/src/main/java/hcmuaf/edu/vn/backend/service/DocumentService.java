package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.dto.CategoryDTO;
import hcmuaf.edu.vn.backend.dto.UniversityDTO;
import hcmuaf.edu.vn.backend.dto.response.DocumentResponseDTO;
import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import hcmuaf.edu.vn.backend.document.ReportDocument;
import hcmuaf.edu.vn.backend.dto.document.ReportRequestDTO;
import hcmuaf.edu.vn.backend.repository.DocumentRepository;
import hcmuaf.edu.vn.backend.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private DocumentRepository documentRepository;

    public Page<DocumentResponseDTO> searchAndFilterDocuments(
            String keyword, String explore, String categoryId,
            String universityId, String sortBy, int page, int size) {

        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (keyword != null && !keyword.trim().isEmpty()) {
            String cleanKeyword = keyword.trim();
            Criteria keywordCriteria = new Criteria().orOperator(
                    Criteria.where("title").regex(cleanKeyword, "i"),
                    Criteria.where("subjectCode").regex(cleanKeyword, "i")
            );
            criteriaList.add(keywordCriteria);
        }

        if (categoryId != null && !categoryId.trim().isEmpty()) {
            criteriaList.add(Criteria.where("categoryId").is(categoryId.trim()));
        }

        if (universityId != null && !universityId.trim().isEmpty()) {
            criteriaList.add(Criteria.where("universityCode").is(universityId.trim()));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt"); // Định dạng mặc định: Mới nhất

        String activeSortCriteria = (explore != null && !explore.isEmpty() && !explore.equals("Tất cả")) ? explore : sortBy;

        if (activeSortCriteria != null) {
            switch (activeSortCriteria) {
                case "Mới nhất":
                    sort = Sort.by(Sort.Direction.DESC, "createdAt");
                    break;
                case "Cũ nhất":
                    sort = Sort.by(Sort.Direction.ASC, "createdAt");
                    break;
                case "Thịnh hành":
                case "Tải nhiều nhất":
                    sort = Sort.by(Sort.Direction.DESC, "downloadCount");
                    break;
                case "Đánh giá cao":
                    sort = Sort.by(Sort.Direction.DESC, "rating");
                    break;
            }
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        query.with(pageable);

        List<FileMetadataDocument> documentList = mongoTemplate.find(query, FileMetadataDocument.class);

        long totalCount = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), FileMetadataDocument.class);

        List<DocumentResponseDTO> dtoList = documentList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, totalCount);
    }

    public void createReport(String documentId, String reporterClerkId, ReportRequestDTO request) {
        if (!documentRepository.existsById(documentId)) {
            throw new RuntimeException("Document not found");
        }

        ReportDocument report = ReportDocument.builder()
                .documentId(documentId)
                .reporterClerkId(reporterClerkId)
                .reason(request.getReason())
                .detail(request.getDetail())
                .status("PENDING")
                .createdAt(Instant.now())
                .build();
        reportRepository.save(report);
    }

    private DocumentResponseDTO convertToDTO(FileMetadataDocument doc) {
        return DocumentResponseDTO.builder()
                .id(doc.getId())
                .title(doc.getTitle())
                .description(doc.getDescription())
                .docType(doc.getDocType())
                .categoryId(doc.getCategoryId())
                .universityCode(doc.getUniversityId())
                .subjectCode(doc.getSubjectCode())
                .creditCost(doc.getCreditCost())
                .rating(doc.getRating())
                .downloadCount(doc.getDownloadCount())
                .thumbnailUrl(doc.getThumbnailUrl())
                .build();
    }

    public List<CategoryDTO> getAllCategories() {
        List<String> distinctCategoryIds = mongoTemplate.findDistinct(
                new Query(), "categoryId", FileMetadataDocument.class, String.class
        );

        return distinctCategoryIds.stream()
                .filter(id -> id != null && !id.trim().isEmpty())
                .map(id -> CategoryDTO.builder()
                        .id(id.trim())
                        .name(id.trim())
                        .build())
                .collect(Collectors.toList());
    }


    public List<UniversityDTO> getAllUniversities() {
        List<String> distinctUniversityIds = mongoTemplate.findDistinct(
                new Query(), "universityId", FileMetadataDocument.class, String.class
        );

        return distinctUniversityIds.stream()
                .filter(id -> id != null && !id.trim().isEmpty())
                .map(id -> UniversityDTO.builder()
                        .id(id.trim())
                        .name(id.trim())
                        .build())
                .collect(Collectors.toList());
    }
}