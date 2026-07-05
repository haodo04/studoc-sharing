package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.dto.request.CreateCollectionRequestDTO;
import hcmuaf.edu.vn.backend.dto.request.RenameCollectionRequestDTO;
import hcmuaf.edu.vn.backend.service.CollectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/collections")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CollectionController {

    private final CollectionService collectionService;

    @GetMapping
    public ResponseEntity<?> list(Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(collectionService.listCollections(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDetail(@PathVariable String id, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            return ResponseEntity.ok(collectionService.getCollectionDetail(id, principal.getName()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/containing/{fileId}")
    public ResponseEntity<?> getContainingFile(@PathVariable String fileId, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(collectionService.getCollectionsContainingFile(fileId, principal.getName()));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateCollectionRequestDTO req, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            return ResponseEntity.ok(collectionService.createCollection(principal.getName(), req.getName()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> rename(@PathVariable String id, @RequestBody RenameCollectionRequestDTO req, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            collectionService.renameCollection(id, principal.getName(), req.getName());
            return ResponseEntity.ok(Map.of("message", "Đã đổi tên bộ sưu tập!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            collectionService.deleteCollection(id, principal.getName());
            return ResponseEntity.ok(Map.of("message", "Đã xoá bộ sưu tập!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/files/{fileId}")
    public ResponseEntity<?> addFile(@PathVariable String id, @PathVariable String fileId, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            collectionService.addFileToCollection(id, fileId, principal.getName());
            return ResponseEntity.ok(Map.of("message", "Đã thêm tài liệu vào bộ sưu tập!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/files/{fileId}")
    public ResponseEntity<?> removeFile(@PathVariable String id, @PathVariable String fileId, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            collectionService.removeFileFromCollection(id, fileId, principal.getName());
            return ResponseEntity.ok(Map.of("message", "Đã bỏ tài liệu khỏi bộ sưu tập!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }
}