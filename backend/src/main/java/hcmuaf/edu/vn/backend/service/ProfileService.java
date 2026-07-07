package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.ProfileDocument;
import hcmuaf.edu.vn.backend.dto.ProfileDTO;
import hcmuaf.edu.vn.backend.exceptions.BadRequestException;
import hcmuaf.edu.vn.backend.exceptions.ResourceNotFoundException;
import hcmuaf.edu.vn.backend.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProfileService {

    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_USER = "USER";

    public static final String BOOTSTRAP_ADMIN_EMAIL = "manager1713181827328@gmail.com";

    private final ProfileRepository profileRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${clerk.secret.key}")
    private String clerkSecretKey;

    public boolean isAdmin(ProfileDocument profile) {
        if (profile == null) return false;
        return ROLE_ADMIN.equals(profile.getRole())
                || (profile.getEmail() != null && BOOTSTRAP_ADMIN_EMAIL.equalsIgnoreCase(profile.getEmail()));
    }

    public ProfileDTO createProfile(ProfileDTO profileDTO) {
        if (profileRepository.existsByClerkId(profileDTO.getClerkId())) {
            return updateProfile(profileDTO);
        }

        ProfileDocument profile = ProfileDocument.builder()
                .clerkId(profileDTO.getClerkId())
                .email(profileDTO.getEmail())
                .firstName(profileDTO.getFirstName())
                .lastName(profileDTO.getLastName())
                .photoUrl(profileDTO.getPhotoUrl())
//                .credits(5)
                .role(profileDTO.getEmail() != null && BOOTSTRAP_ADMIN_EMAIL.equalsIgnoreCase(profileDTO.getEmail())
                        ? ROLE_ADMIN : ROLE_USER)
                .createdAt(Instant.now())
                .build();

        profile = profileRepository.save(profile);
        return mapToDTO(profile);
    }

    public ProfileDTO updateProfile(ProfileDTO profileDTO) {
        ProfileDocument existingProfile = profileRepository.findByClerkId(profileDTO.getClerkId());

        if (existingProfile == null) {
            throw new ResourceNotFoundException("Thông tin người dùng không tồn tại với ID: " + profileDTO.getClerkId());
        }

        String clerkApiUrl = "https://api.clerk.com/v1/users/" + profileDTO.getClerkId();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(clerkSecretKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("first_name", profileDTO.getFirstName());
        body.put("last_name", profileDTO.getLastName());

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            restTemplate.exchange(clerkApiUrl, HttpMethod.PATCH, requestEntity, String.class);
            System.out.println("Đồng bộ cập nhật User lên Clerk thành công!");
        } catch (Exception e) {
            System.err.println("Lỗi đồng bộ cập nhật lên Clerk: " + e.getMessage());
        }

        existingProfile.setEmail(profileDTO.getEmail());
        existingProfile.setFirstName(profileDTO.getFirstName());
        existingProfile.setLastName(profileDTO.getLastName());
        existingProfile.setPhotoUrl(profileDTO.getPhotoUrl());

        ProfileDocument savedProfile = profileRepository.save(existingProfile);
        return mapToDTO(savedProfile);
    }

    public boolean existsByClerkId(String clerkId) {
        return profileRepository.existsByClerkId(clerkId);
    }

    public List<ProfileDTO> getAllProfiles() {
        List<ProfileDocument> profiles = profileRepository.findAll();
        return profiles.stream()
                .map(this::mapToDTO)
                .toList();
    }

    public void deleteProfile(String clerkId) {
        ProfileDocument existingProfile = profileRepository.findByClerkId(clerkId);
        if (existingProfile == null) {
            throw new ResourceNotFoundException("Không thể xóa! Profile không tồn tại với ID: " + clerkId);
        }

        String clerkApiUrl = "https://api.clerk.com/v1/users/" + clerkId;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(clerkSecretKey);
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        try {
            restTemplate.exchange(clerkApiUrl, HttpMethod.DELETE, requestEntity, String.class);
            System.out.println("Đã xóa User trên Clerk Dashboard thành công!");
        } catch (org.springframework.web.client.HttpClientErrorException.NotFound e) {
            System.out.println("User không tồn tại trên Clerk (có thể đã xóa trước đó). Tiến hành dọn dẹp DB...");
        } catch (Exception e) {
            System.err.println("Lỗi hệ thống khi đồng bộ xóa lên Clerk: " + e.getMessage());
            throw new BadRequestException("Xóa thất bại! Lỗi kết nối đồng bộ với Clerk.");
        }

        profileRepository.delete(existingProfile);
        System.out.println("Đã xóa User khỏi Database thành công!");
    }

    public ProfileDocument getCurrentProfile() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            throw new BadRequestException("Yêu cầu không hợp lệ! Người dùng chưa được xác thực (Unauthenticated)");
        }

        String clerkId = SecurityContextHolder.getContext().getAuthentication().getName();

        ProfileDocument currentProfile = profileRepository.findByClerkId(clerkId);
        if (currentProfile == null) {
            throw new ResourceNotFoundException("Không tìm thấy thông tin hồ sơ tài khoản với ID: " + clerkId);
        }
        return currentProfile;
    }

    private ProfileDTO mapToDTO(ProfileDocument profile) {
        return ProfileDTO.builder()
                .clerkId(profile.getClerkId())
                .email(profile.getEmail())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
//                .credits(profile.getCredits())
                .photoUrl(profile.getPhotoUrl())
                .createdAt(profile.getCreatedAt())
                .build();
    }
}