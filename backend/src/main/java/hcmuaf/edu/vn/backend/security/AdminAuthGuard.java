package hcmuaf.edu.vn.backend.security;

import hcmuaf.edu.vn.backend.document.ProfileDocument;
import hcmuaf.edu.vn.backend.repository.ProfileRepository;
import hcmuaf.edu.vn.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.security.Principal;

@Component
@RequiredArgsConstructor
public class AdminAuthGuard {

    private final ProfileRepository profileRepository;
    private final ProfileService profileService;

    public void assertIsAdmin(Principal principal) {
        if (principal == null) {
            throw new SecurityException("Bạn cần đăng nhập để thực hiện thao tác này.");
        }

        ProfileDocument profile = profileRepository.findByClerkId(principal.getName());
        if (!profileService.isAdmin(profile)) {
            throw new SecurityException("Bạn không có quyền truy cập chức năng quản trị này.");
        }
    }
}