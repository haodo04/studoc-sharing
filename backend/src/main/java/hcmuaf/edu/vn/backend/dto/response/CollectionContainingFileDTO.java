package hcmuaf.edu.vn.backend.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CollectionContainingFileDTO {
    private String id;
    private String name;
    private int fileCount;
    private boolean containsFile;
}