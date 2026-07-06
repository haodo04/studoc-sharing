package hcmuaf.edu.vn.backend.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "system_settings")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SystemSettingDocument {
    @Id
    private String id; // We will use a fixed ID like "GLOBAL_SETTING"
    
    private boolean bannerEnabled;
    private String bannerMessage;
    private String bannerColor; // e.g., "blue", "red", "yellow"
    private String bannerLink; // optional link to click
}
