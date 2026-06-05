package hcmuaf.edu.vn.backend.repository.iml;

import hcmuaf.edu.vn.backend.document.FileMetadataDocument;
import hcmuaf.edu.vn.backend.repository.FileMetadataRepositoryCustom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class FileMetadataRepositoryCustomImpl implements FileMetadataRepositoryCustom {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public Page<FileMetadataDocument> searchAndFilterDocuments(
            String keyword, String explore, String categoryId, String universityId, String sortBy, Pageable pageable) {

        Query query = new Query();

        // 1. Chỉ lấy các tài liệu đang được public
        query.addCriteria(Criteria.where("isPublic").is(true));

        // 2. Lọc theo từ khóa tìm kiếm (Tìm trong title hoặc subjectCode)
        if (keyword != null && !keyword.trim().isEmpty()) {
            Criteria keywordCriteria = new Criteria().orOperator(
                    Criteria.where("title").regex(keyword, "i"), // 'i' là không phân biệt hoa thường
                    Criteria.where("subjectCode").regex(keyword, "i"),
                    Criteria.where("subjectName").regex(keyword, "i")
            );
            query.addCriteria(keywordCriteria);
        }

        // 3. Lọc theo Ngành học
        if (categoryId != null && !categoryId.trim().isEmpty() && !categoryId.equals("Tất cả")) {
            query.addCriteria(Criteria.where("categoryId").is(categoryId));
        }

        // 4. Lọc theo Trường đại học
        if (universityId != null && !universityId.trim().isEmpty()) {
            query.addCriteria(Criteria.where("universityId").is(universityId));
        }

        // 5. Xử lý logic Sắp xếp (Sort) hoặc "Khám phá" (Explore)
        String activeSort = (sortBy != null && !sortBy.isEmpty()) ? sortBy : explore;

        if (activeSort != null) {
            switch (activeSort) {
                case "Mới nhất":
                    query.with(Sort.by(Sort.Direction.DESC, "uploadedAt"));
                    break;
                case "Đánh giá cao":
                    query.with(Sort.by(Sort.Direction.DESC, "rating"));
                    break;
                case "Tải nhiều nhất":
                case "Thịnh hành":
                    query.with(Sort.by(Sort.Direction.DESC, "downloadCount"));
                    break;
                case "Cũ nhất":
                    query.with(Sort.by(Sort.Direction.ASC, "uploadedAt"));
                    break;
                default:
                    // Mặc định sort theo mới nhất
                    query.with(Sort.by(Sort.Direction.DESC, "uploadedAt"));
                    break;
            }
        } else {
            query.with(Sort.by(Sort.Direction.DESC, "uploadedAt"));
        }

        // 6. Đếm tổng số lượng (dành cho phân trang)
        long total = mongoTemplate.count(query, FileMetadataDocument.class);

        // 7. Áp dụng phân trang (Limit & Offset)
        query.with(pageable);

        // 8. Thực thi truy vấn
        List<FileMetadataDocument> documents = mongoTemplate.find(query, FileMetadataDocument.class);

        return new PageImpl<>(documents, pageable, total);
    }
}