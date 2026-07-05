package hcmuaf.edu.vn.backend.config;

import hcmuaf.edu.vn.backend.security.ClerkJwksProvider;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.security.Principal;
import java.security.PublicKey;
import java.util.Base64;

@Component
@RequiredArgsConstructor
public class StompAuthChannelInterceptor implements ChannelInterceptor {

    @Value("${clerk.issuer}")
    private String clerkIssuer;

    private final ClerkJwksProvider jwksProvider;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        // dùng getAccessor thay vì wrap() -> lấy đúng accessor mutable đang gắn với session,
        // để setUser() ghi được vào session thật, không phải bản sao rời rạc
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) {
            return message;
        }

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                try {
                    String clerkId = verifyAndExtractClerkId(authHeader.substring(7));
                    accessor.setUser((Principal) () -> clerkId);
                } catch (Exception e) {
                    System.err.println("WS auth: JWT không hợp lệ - " + e.getMessage());
                }
            }
        }

        if (StompCommand.SEND.equals(accessor.getCommand())) {
            if (accessor.getUser() == null) {
                throw new org.springframework.messaging.MessagingException(
                        "Bạn cần đăng nhập để gửi tin nhắn trong Cộng đồng");
            }
        }

        // build lại message với header đã chỉnh sửa để đảm bảo thay đổi được áp dụng
        return MessageBuilder.createMessage(message.getPayload(), accessor.getMessageHeaders());
    }

    private String verifyAndExtractClerkId(String token) throws Exception {
        String[] chunks = token.split("\\.");
        if (chunks.length < 3) throw new IllegalArgumentException("Invalid JWT format");

        String headerJson = new String(Base64.getUrlDecoder().decode(chunks[0]));
        JsonNode headerNode = new ObjectMapper().readTree(headerJson);
        String kid = headerNode.get("kid").asText();
        PublicKey publicKey = jwksProvider.getPublicKey(kid);

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(publicKey)
                .setAllowedClockSkewSeconds(60)
                .requireIssuer(clerkIssuer)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }
}