package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.dto.admin.SystemSettingDTO;
import hcmuaf.edu.vn.backend.service.SystemSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/settings")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SystemSettingController {

    private final SystemSettingService settingService;

    // Public endpoint so frontend can fetch banner
    @GetMapping
    public ResponseEntity<SystemSettingDTO> getSettings() {
        var doc = settingService.getSettings();
        SystemSettingDTO dto = SystemSettingDTO.builder()
                .bannerEnabled(doc.isBannerEnabled())
                .bannerMessage(doc.getBannerMessage())
                .bannerColor(doc.getBannerColor())
                .bannerLink(doc.getBannerLink())
                .build();
        return ResponseEntity.ok(dto);
    }

    // Only admin should call this (handled by Spring Security/Clerk filter)
    @PutMapping
    public ResponseEntity<SystemSettingDTO> updateSettings(@RequestBody SystemSettingDTO dto) {
        var doc = settingService.updateSettings(dto);
        SystemSettingDTO updated = SystemSettingDTO.builder()
                .bannerEnabled(doc.isBannerEnabled())
                .bannerMessage(doc.getBannerMessage())
                .bannerColor(doc.getBannerColor())
                .bannerLink(doc.getBannerLink())
                .build();
        return ResponseEntity.ok(updated);
    }
}
