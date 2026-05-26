package hcmuaf.edu.vn.backend.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "categories")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDocument {
    @Id
    private String id;           // Ví dụ: "cntt", "kinh-te", "toan-khoa-hoc"
    private String name;         // Ví dụ: "Công Nghệ Thông Tin & Kỹ Thuật"
    private String iconName;     // Tên icon Lucide (ví dụ: "Laptop", "TrendingUp") để FE render icon động
}
