package hcmuaf.edu.vn.backend.controller;

import hcmuaf.edu.vn.backend.dto.response.FavoriteResponseDTO;
import hcmuaf.edu.vn.backend.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{fileId}/toggle")
    public ResponseEntity<Boolean> toggleFavorite(@PathVariable String fileId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String clerkId = principal.getName();
        boolean status = favoriteService.toggleFavorite(clerkId, fileId);
        return ResponseEntity.ok(status);
    }

    @GetMapping("/check/{fileId}")
    public ResponseEntity<Boolean> checkFavoriteStatus(@PathVariable String fileId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.ok(false);
        }
        String clerkId = principal.getName();
        boolean status = favoriteService.checkFavoriteStatus(clerkId, fileId);
        return ResponseEntity.ok(status);
    }

    @GetMapping
    public ResponseEntity<List<FavoriteResponseDTO>> getUserFavorites(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String clerkId = principal.getName();
        List<FavoriteResponseDTO> favorites = favoriteService.getUserFavorites(clerkId);
        return ResponseEntity.ok(favorites);
    }
}
