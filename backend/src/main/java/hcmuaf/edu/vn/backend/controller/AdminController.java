package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.dto.admin.DashboardStatsDTO;
import hcmuaf.edu.vn.backend.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import hcmuaf.edu.vn.backend.dto.admin.AdminUserDTO;
import hcmuaf.edu.vn.backend.dto.admin.AdminDocumentDTO;
import hcmuaf.edu.vn.backend.dto.admin.AdminCommunityDTO;
import hcmuaf.edu.vn.backend.dto.admin.AdminTransactionDTO;
import hcmuaf.edu.vn.backend.dto.admin.AdminReportDTO;
import hcmuaf.edu.vn.backend.service.AdminUserService;
import hcmuaf.edu.vn.backend.service.AdminDocumentService;
import hcmuaf.edu.vn.backend.service.AdminCommunityService;
import hcmuaf.edu.vn.backend.service.AdminTransactionService;
import hcmuaf.edu.vn.backend.service.AdminReportService;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminDashboardService adminDashboardService;
    private final AdminUserService adminUserService;
    private final AdminDocumentService adminDocumentService;
    private final AdminCommunityService adminCommunityService;
    private final AdminTransactionService adminTransactionService;
    private final AdminReportService adminReportService;

    @GetMapping("/dashboard-stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminDashboardService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDTO>> getAllUsers() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    @PutMapping("/users/{clerkId}/ban")
    public ResponseEntity<Void> toggleUserBan(@PathVariable String clerkId) {
        adminUserService.toggleUserBan(clerkId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/documents")
    public ResponseEntity<List<AdminDocumentDTO>> getAllDocuments() {
        return ResponseEntity.ok(adminDocumentService.getAllDocuments());
    }

    @PutMapping("/documents/{id}/toggle-visibility")
    public ResponseEntity<Void> toggleDocumentVisibility(@PathVariable String id) {
        adminDocumentService.toggleDocumentVisibility(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/documents/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable String id) throws IOException {
        adminDocumentService.deleteDocument(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/community")
    public ResponseEntity<List<AdminCommunityDTO>> getCommunityActivities() {
        return ResponseEntity.ok(adminCommunityService.getAllActivities());
    }

    @DeleteMapping("/community/{type}/{id}")
    public ResponseEntity<Void> deleteCommunityActivity(@PathVariable String type, @PathVariable String id) {
        adminCommunityService.deleteActivity(type, id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<AdminTransactionDTO>> getTransactions() {
        return ResponseEntity.ok(adminTransactionService.getAllTransactions());
    }

    @GetMapping("/reports")
    public ResponseEntity<List<AdminReportDTO>> getReports() {
        return ResponseEntity.ok(adminReportService.getAllReports());
    }

    @PutMapping("/reports/{id}/status")
    public ResponseEntity<Void> updateReportStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        adminReportService.updateReportStatus(id, status);
        return ResponseEntity.ok().build();
    }
}
