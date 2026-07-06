package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import hcmuaf.edu.vn.backend.document.ProfileDocument;
import hcmuaf.edu.vn.backend.dto.admin.AdminUserDTO;
import hcmuaf.edu.vn.backend.repository.FileMetadataRepository;
import hcmuaf.edu.vn.backend.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final ProfileRepository profileRepository;
    private final FileMetadataRepository fileMetadataRepository;

    public List<AdminUserDTO> getAllUsers() {
        List<ProfileDocument> profiles = profileRepository.findAll();
        List<FileMetadataDocument> files = fileMetadataRepository.findAll();

        return profiles.stream().map(profile -> {
            long totalUploads = files.stream()
                    .filter(f -> profile.getClerkId() != null && profile.getClerkId().equals(f.getClerkId()))
                    .count();

            long totalDownloads = files.stream()
                    .filter(f -> profile.getClerkId() != null && profile.getClerkId().equals(f.getClerkId()))
                    .mapToLong(FileMetadataDocument::getDownloadCount)
                    .sum();

            return AdminUserDTO.builder()
                    .id(profile.getId())
                    .clerkId(profile.getClerkId())
                    .email(profile.getEmail())
                    .fullName(profile.getFirstName() + " " + profile.getLastName())
                    .photoUrl(profile.getPhotoUrl())
                    .joinedAt(profile.getCreatedAt())
                    .totalUploads(totalUploads)
                    .totalDownloads(totalDownloads)
                    .isBanned(Boolean.TRUE.equals(profile.getIsBanned()))
                    .build();
        }).collect(Collectors.toList());
    }

    public void toggleUserBan(String clerkId) {
        ProfileDocument profile = profileRepository.findByClerkId(clerkId);
        if (profile == null) {
            throw new RuntimeException("User not found");
        }
        
        boolean currentStatus = Boolean.TRUE.equals(profile.getIsBanned());
        profile.setIsBanned(!currentStatus);
        
        profileRepository.save(profile);
    }
}
