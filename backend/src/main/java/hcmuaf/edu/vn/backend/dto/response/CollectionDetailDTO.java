package hcmuaf.edu.vn.backend.dto.response;

import hcmuaf.edu.vn.backend.dto.FileMetadataDTO;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CollectionDetailDTO {
    private String id;
    private String name;
    private LocalDateTime createdAt;
    private List<FileMetadataDTO> files;
}