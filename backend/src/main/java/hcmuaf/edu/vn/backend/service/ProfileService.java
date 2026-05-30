package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.ProfileDocument;
import hcmuaf.edu.vn.backend.dto.ProfileDTO;
import hcmuaf.edu.vn.backend.exceptions.BadRequestException;
import hcmuaf.edu.vn.backend.exceptions.ResourceNotFoundException;
import hcmuaf.edu.vn.backend.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepository;

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
                .credits(5)
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
        profileRepository.delete(existingProfile);
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
                .credits(profile.getCredits())
                .photoUrl(profile.getPhotoUrl())
                .createdAt(profile.getCreatedAt())
                .build();
    }
}