package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.dto.CommentDTO;
import hcmuaf.edu.vn.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/file/{fileId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByFileId(@PathVariable String fileId) {
        List<CommentDTO> comments = commentService.getCommentsByFileId(fileId);
        return ResponseEntity.ok(comments);
    }


    @PostMapping("/file/{fileId}")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable String fileId,
            @RequestBody CommentDTO commentDTO) {

        CommentDTO savedComment = commentService.addComment(fileId, commentDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
    }
}