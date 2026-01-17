package com.rdt.auth.component;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class JwtProviderTest {

    @org.mockito.Mock
    private com.rdt.auth.config.JwtProperties jwtProperties;

    @InjectMocks
    private JwtProvider jwtProvider;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        org.mockito.Mockito.lenient()
                .when(jwtProperties.getSecret())
                .thenReturn("mySecretKeyAvailableForTestingPurposeOnly123456");
        org.mockito.Mockito.lenient().when(jwtProperties.getExpiration()).thenReturn(3600000L);
        jwtProvider.init();
    }

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
    void validateToken_InvalidToken() {
        assertFalse(jwtProvider.validateToken("invalid.token.here"));
    }

    @Test
    void validateToken_TamperedToken() {
        String token = jwtProvider.generateToken("testuser");
        String tamperedToken = token + "tamper";
        assertFalse(jwtProvider.validateToken(tamperedToken));
    }

    @Test
    void getUsernameFromToken_Success() {
        String token = jwtProvider.generateToken("testuser");
        assertEquals("testuser", jwtProvider.getUsernameFromToken(token));
    }
}
