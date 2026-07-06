package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.SystemSettingDocument;
import hcmuaf.edu.vn.backend.dto.admin.SystemSettingDTO;
import hcmuaf.edu.vn.backend.repository.SystemSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SystemSettingService {

    private final SystemSettingRepository repository;
    private static final String SETTING_ID = "GLOBAL_SETTING";

    public SystemSettingDocument getSettings() {
        return repository.findById(SETTING_ID)
                .orElseGet(() -> {
                    SystemSettingDocument defaultSettings = SystemSettingDocument.builder()
                            .id(SETTING_ID)
                            .bannerEnabled(false)
                            .bannerMessage("Chào mừng bạn đến với hệ thống chia sẻ tài liệu trực tuyến!")
                            .bannerColor("blue")
                            .bannerLink("")
                            .build();
                    return repository.save(defaultSettings);
                });
    }

    public SystemSettingDocument updateSettings(SystemSettingDTO dto) {
        SystemSettingDocument settings = getSettings();
        settings.setBannerEnabled(dto.isBannerEnabled());
        settings.setBannerMessage(dto.getBannerMessage());
        settings.setBannerColor(dto.getBannerColor());
        settings.setBannerLink(dto.getBannerLink());
        return repository.save(settings);
    }
}
