package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import hcmuaf.edu.vn.backend.document.ProfileDocument;
import hcmuaf.edu.vn.backend.document.ReportDocument;
import hcmuaf.edu.vn.backend.dto.admin.AdminReportDTO;
import hcmuaf.edu.vn.backend.repository.DocumentRepository;
import hcmuaf.edu.vn.backend.repository.ProfileRepository;
import hcmuaf.edu.vn.backend.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminReportService {

    private final ReportRepository reportRepository;
    private final ProfileRepository profileRepository;
    private final DocumentRepository documentRepository;

    public List<AdminReportDTO> getAllReports() {
        List<ReportDocument> reports = reportRepository.findAll();
        List<ProfileDocument> profiles = profileRepository.findAll();
        List<FileMetadataDocument> documents = documentRepository.findAll();

        Map<String, ProfileDocument> profileMap = profiles.stream()
                .collect(Collectors.toMap(ProfileDocument::getClerkId, p -> p, (p1, p2) -> p1));
        
        Map<String, String> documentTitleMap = documents.stream()
                .collect(Collectors.toMap(
                        FileMetadataDocument::getId,
                        doc -> doc.getTitle() != null ? doc.getTitle() : (doc.getName() != null ? doc.getName() : "Unknown Document"),
                        (t1, t2) -> t1
                ));

        return reports.stream()
                .map(report -> {
                    ProfileDocument profile = profileMap.get(report.getReporterClerkId());
                    String reporterName = profile != null ? (profile.getFirstName() + " " + profile.getLastName()).trim() : "Unknown User";
                    String reporterEmail = profile != null ? profile.getEmail() : "No Email";
                    String docTitle = documentTitleMap.getOrDefault(report.getDocumentId(), "Deleted Document");

                    return AdminReportDTO.builder()
                            .id(report.getId())
                            .documentId(report.getDocumentId())
                            .documentTitle(docTitle)
                            .reporterName(reporterName)
                            .reporterEmail(reporterEmail)
                            .reason(report.getReason())
                            .detail(report.getDetail())
                            .status(report.getStatus())
                            .createdAt(report.getCreatedAt())
                            .build();
                })
                .sorted(Comparator.comparing(AdminReportDTO::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
    }

    public void updateReportStatus(String reportId, String status) {
        ReportDocument report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(status);
        reportRepository.save(report);
    }
}
