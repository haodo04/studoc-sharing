package hcmuaf.edu.vn.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDTO {
    private String id;
    private String clerkId;
    private String email;
    private String fullName;
    private String photoUrl;
    private Instant joinedAt;
    private long totalUploads;
    private long totalDownloads;
    private boolean isBanned;
}
