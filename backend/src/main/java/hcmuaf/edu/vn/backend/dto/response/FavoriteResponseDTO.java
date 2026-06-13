package hcmuaf.edu.vn.backend.dto.response;

import hcmuaf.edu.vn.backend.dto.FileMetadataDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteResponseDTO {
    private String favoriteId;
    private String fileId;
    private String clerkId;
    private LocalDateTime savedAt;
    private FileMetadataDTO file;
}
