//$Id$
package com.resource.dao;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import com.fasterxml.jackson.core.JsonProcessingException;
import  com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.annotation.JsonView;

import java.util.Date;
import javax.crypto.SecretKey;

public class JwtUtil {
	 private static final String key = "zZrq0sZK2yt9RJk51RTJ/keU6WERbvr8nqKMWQJRX1E=" ;

    private static final long EXPIRATION_TIME = 86400000;

    @SuppressWarnings("deprecation")
	public static String generateToken(String userId, String userType) {
        Date expirationDate = new Date(System.currentTimeMillis() + EXPIRATION_TIME);
 
        return Jwts.builder()
                .setSubject(userId)
                .claim("userType", userType)
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS256, key)
                .compact();
    }

    @SuppressWarnings("deprecation")
	public static Claims parseToken(String token) {
        return Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token)
                .getBody();
    }
    
    public boolean isValidToken(String token , String path) {
        try {
           
            Claims claims = parseToken(token);
            String userType = (String)claims.get("userType");

            
            UserRole userRole = null;
            
            if(userType.equals("1")) {
            	userRole = UserRole.USER;
            }
            else if(userType.equals("2")) {
            	userRole = UserRole.DRIVER;
            }
            else if(userType.equals("3")){
            	userRole = UserRole.ADMIN;
            }
            
            boolean canAccess = userRole.canAccessResource(path);
            
            return canAccess; 
        } catch (Exception e) {
            return false;
        }
            
    }

}

