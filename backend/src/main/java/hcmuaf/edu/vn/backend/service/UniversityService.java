package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.dto.UniversityDTO;
import hcmuaf.edu.vn.backend.repository.UniversityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UniversityService {
    private final UniversityRepository universityRepository;

    public List<UniversityDTO> getAllUniversities() {
        return universityRepository.findAll().stream()
                .map(u -> UniversityDTO.builder()
                        .id(u.getId())
                        .name(u.getName())
                        .shortName(u.getShortName())
                        .logoUrl(u.getLogoUrl())
                        .isFeatured(u.isFeatured())
                        .build())
                .collect(Collectors.toList());
    }
}
