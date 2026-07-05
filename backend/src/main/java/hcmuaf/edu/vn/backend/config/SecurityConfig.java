package hcmuaf.edu.vn.backend.config;

import hcmuaf.edu.vn.backend.security.ClerkJwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final ClerkJwtAuthFilter clerkJwtAuthFilter;

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .addFilterBefore(corsFilter(), UsernamePasswordAuthenticationFilter.class)

                .addFilterAfter(clerkJwtAuthFilter, CorsFilter.class)

                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers("/files/interaction/**").authenticated()
                        .requestMatchers("/files/manage/**").authenticated()
                        .requestMatchers("/favorites/**").authenticated()
                        .requestMatchers("/users/credits").authenticated()

                        .requestMatchers("/files/*/ai-studio/**").authenticated()

                        .requestMatchers("/files/public/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/files/{id}/related").permitAll()
                        .requestMatchers(HttpMethod.GET, "/files/{id}").permitAll()

                        .requestMatchers(HttpMethod.GET, "/discussions/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/discussions/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/discussions/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/discussions/**").authenticated()

                        .requestMatchers("/comments/**", "/webhooks/**", "/register").permitAll()
                        .requestMatchers("/api/payment/vnpay_return").permitAll()
                        .requestMatchers("/payments/**").permitAll()
                        .requestMatchers("/uploads/**", "/documents/**", "/error").permitAll()
                        .requestMatchers("/metadata/**").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return httpSecurity.build();
    }
}