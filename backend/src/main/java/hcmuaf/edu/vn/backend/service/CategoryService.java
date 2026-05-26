package hcmuaf.edu.vn.backend.service;

import hcmuaf.edu.vn.backend.dto.CategoryDTO;
import hcmuaf.edu.vn.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> CategoryDTO.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .iconName(c.getIconName())
                        .build())
                .collect(Collectors.toList());
    }
}