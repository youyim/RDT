package com.rdt.auth.component;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class JwtProviderTest {

    @InjectMocks
    private JwtProvider jwtProvider;

    @Test
    void generateToken_Success() {
        // Act
        String token = jwtProvider.generateToken("testuser");

        // Assert
        assertNotNull(token);
        assertTrue(token.length() > 0);
    }

    @Test
    void validateToken_Success() {
        String token = jwtProvider.generateToken("testuser");
        assertTrue(jwtProvider.validateToken(token));
    }

    @Test
    void getUsernameFromToken_Success() {
        String token = jwtProvider.generateToken("testuser");
        assertEquals("testuser", jwtProvider.getUsernameFromToken(token));
    }
}
