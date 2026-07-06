package hcmuaf.edu.vn.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.security.PublicKey;
import java.util.Base64;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class ClerkJwtAuthFilter extends OncePerRequestFilter {

    @Value("${clerk.issuer}")
    private String clerkIssuer;

    private final ClerkJwksProvider jwksProvider;
    private final hcmuaf.edu.vn.backend.repository.ProfileRepository profileRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        String method = request.getMethod();

        if ("OPTIONS".equalsIgnoreCase(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        String lowerURI = requestURI.toLowerCase();

        boolean isVnPayReturn = lowerURI.contains("/api/payment/vnpay_return");
        boolean isMetadataPublic = lowerURI.contains("/metadata/") || (lowerURI.contains("/categories") && "GET".equalsIgnoreCase(method)) || (lowerURI.contains("/universities") && "GET".equalsIgnoreCase(method));
        boolean isBasePublic = lowerURI.contains("/webhooks") || lowerURI.contains("/register") || (lowerURI.contains("/settings") && "GET".equalsIgnoreCase(method))
                || lowerURI.contains("/uploads") || lowerURI.contains("/community/messages")
                || lowerURI.contains("/ws");
        boolean isPublicFiles = lowerURI.contains("/files/public/");
        boolean isDocumentsPublic = lowerURI.contains("/documents/") && !lowerURI.contains("/admin/") && "GET".equalsIgnoreCase(method);
        boolean isGetComments = (lowerURI.contains("/comments") || lowerURI.contains("/discussions"))
                && "GET".equalsIgnoreCase(method);
        boolean isAssistant = lowerURI.contains("/assistant");

        boolean isGetDocumentDetail = "GET".equalsIgnoreCase(method) &&
                (lowerURI.contains("/related") || (lowerURI.contains("/files/")
                        && !lowerURI.contains("/interaction")
                        && !lowerURI.contains("/manage")
                        && !lowerURI.contains("/ai-studio")));

        // Nhóm 1: public tuyệt đối, không cần biết user là ai -> bỏ qua luôn, KHÔNG parse token
        boolean isFullyPublic = isMetadataPublic || isBasePublic || isGetComments || isVnPayReturn || isDocumentsPublic;

        if (isFullyPublic) {
            filterChain.doFilter(request, response);
            return;
        }

        // Nhóm 2: public nhưng cần biết user nếu có đăng nhập (
        boolean isOptionalAuth = isGetDocumentDetail || isPublicFiles || isAssistant;

        if (isOptionalAuth) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                try {
                    authenticate(authHeader.substring(7), request);
                } catch (Exception e) {
                    System.err.println("Optional auth: JWT không hợp lệ, tiếp tục như khách - " + e.getMessage());
                }
            }
            filterChain.doFilter(request, response);
            return;
        }

        // Nhóm 3: route bắt buộc phải đăng nhập
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization header missing/invalid");
            return;
        }

        try {
            authenticate(authHeader.substring(7), request);
            
            // Ban check
            if (!lowerURI.contains("/users/me/status")) {
                String clerkId = (String) request.getAttribute("clerkId");
                if (clerkId != null) {
                    hcmuaf.edu.vn.backend.document.ProfileDocument p = profileRepository.findByClerkId(clerkId);
                    boolean isBanned = p != null && Boolean.TRUE.equals(p.getIsBanned());
                    if (isBanned) {
                        response.sendError(HttpServletResponse.SC_FORBIDDEN, "User is banned");
                        return;
                    }
                }
            }

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            System.err.println("JWT validation failed: " + e.getClass().getName() + " - " + e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token: " + e.getMessage());
        }
    }

    /**
     * Parse + verify JWT, set SecurityContext nếu hợp lệ.
     * Ném exception nếu token sai định dạng / chữ ký / issuer -> caller tự quyết định xử lý (chặn hay bỏ qua).
     */
    private void authenticate(String token, HttpServletRequest request) throws Exception {
        String[] chunks = token.split("\\.");

        if (chunks.length < 3) {
            throw new IllegalArgumentException("Invalid JWT token format");
        }

        String headerJson = new String(Base64.getUrlDecoder().decode(chunks[0]));
        ObjectMapper mapper = new ObjectMapper();
        JsonNode headerNode = mapper.readTree(headerJson);

        if (!headerNode.has("kid")) {
            throw new IllegalArgumentException("Token header is missing kid");
        }

        String kid = headerNode.get("kid").asText();
        PublicKey publicKey = jwksProvider.getPublicKey(kid);
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(publicKey)
                .setAllowedClockSkewSeconds(60)
                .requireIssuer(clerkIssuer)
                .build()
                .parseClaimsJws(token)
                .getBody();

        String clerkId = claims.getSubject();

        request.setAttribute("clerkId", clerkId);

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                clerkId, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
        authenticationToken.setDetails(new org.springframework.security.web.authentication.WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
    }
}