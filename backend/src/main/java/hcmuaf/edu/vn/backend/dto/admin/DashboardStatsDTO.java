package hcmuaf.edu.vn.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalUsers;
    private long totalDocuments;
    private long totalRevenue;
    private List<DocumentSummary> recentUploads;
    private List<ChartData> userGrowth;
    private List<ChartData> documentsByCategory;
}
