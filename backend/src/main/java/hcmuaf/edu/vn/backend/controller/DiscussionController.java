package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.document.DiscussionDocument;
import hcmuaf.edu.vn.backend.service.DiscussionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/discussions")
@RequiredArgsConstructor
public class DiscussionController {

    private final DiscussionService discussionService;

    @GetMapping("/file/{fileId}")
    public ResponseEntity<List<DiscussionDocument>> getByFile(@PathVariable String fileId) {
        return ResponseEntity.ok(discussionService.getByFile(fileId));
    }

    @PostMapping("/file/{fileId}")
    public ResponseEntity<DiscussionDocument> create(
            @PathVariable String fileId,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {

        String clerkId = (String) request.getAttribute("clerkId");
        String parentId = body.get("parentId"); // null nếu comment gốc
        String content = body.get("content");
        String fullName = body.get("userFullName");
        String photoUrl = body.get("userPhotoUrl");

        DiscussionDocument created = discussionService.create(
                fileId, parentId, clerkId, fullName, photoUrl, content);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiscussionDocument> update(
            @PathVariable String id,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {

        String clerkId = (String) request.getAttribute("clerkId");
        DiscussionDocument updated = discussionService.update(id, clerkId, body.get("content"));
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id, HttpServletRequest request) {
        String clerkId = (String) request.getAttribute("clerkId");
        discussionService.delete(id, clerkId);
        return ResponseEntity.noContent().build();
    }
}