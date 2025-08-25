package com.promptsql.server.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Decoders;
import org.springframework.stereotype.Service;

import java.security.Key;

@Service
public class JwtService {


    private final String jwtSecret = "bXlTdXBlclNlY3JldEtleTEyMzQ1bXlTdXBlclNlY3JldEtleTEyMzQ1";

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String email) {
        long nowSeconds = System.currentTimeMillis() / 1000;
        Key key = getSigningKey();

        return Jwts.builder()
                .claim("sub", email)
                .claim("iat", nowSeconds)
                .claim("exp", nowSeconds + 3600)
                .signWith(key)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
