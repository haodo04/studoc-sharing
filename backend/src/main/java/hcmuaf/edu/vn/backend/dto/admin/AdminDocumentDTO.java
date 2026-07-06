package hcmuaf.edu.vn.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDocumentDTO {
    private String id;
    private String title;
    private String subjectName;
    private String docType;
    private String uploaderName;
    private String uploaderEmail;
    private int viewCount;
    private int downloadCount;
    private Boolean isPublic;
    private LocalDateTime uploadedAt;
    private String fileLocation;
    private String type; // pdf, docx, etc.
}
