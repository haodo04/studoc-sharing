package hcmuaf.edu.vn.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDTO {
    @NotBlank(message = "clerkId is required")
    private String clerkId;

    @NotBlank(message = "email is required")
    private String email;

    @NotBlank(message = "firstName is required")
    private String firstName;

    @NotBlank(message = "lastName is required")
    private String lastName;

    @NotBlank(message = "credits is required")
    private Integer credits;

    @NotBlank(message = "photoUrl is required")
    private String photoUrl;

    private Instant createdAt;
}