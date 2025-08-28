package com.promptsql.server.config;
import com.promptsql.server.service.JwtService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.SecurityFilterChain;

import java.net.URLEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtService jwtService;

    @Value("${frontend.url}")
private String frontendUrl;


    public SecurityConfig(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/**").permitAll()
                        .anyRequest().permitAll()
                )

                .oauth2Login(oauth -> oauth
                        .successHandler((request, response, authentication) -> {

                            DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();
                            String email = ((DefaultOAuth2User) authentication.getPrincipal()).getAttribute("email");
                            String firstName = oauthUser.getAttribute("given_name");
                            String lastName = oauthUser.getAttribute("family_name");

                            String token = jwtService.generateToken(email);


                           String redirectUrl = String.format(
    "%s/oauth2/redirect?token=%s&email=%s&firstName=%s&lastName=%s",
    frontendUrl,
    token,
    URLEncoder.encode(email, "UTF-8"),
    URLEncoder.encode(firstName, "UTF-8"),
    URLEncoder.encode(lastName, "UTF-8")
);
response.sendRedirect(redirectUrl);

                        })
                )
                .cors(cors -> {});

        return http.build();
    }
}

