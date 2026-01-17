package com.rdt;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Integration test that verifies Spring context can be loaded.
 * Disabled during unit tests as it requires a running database.
 * Run manually or in integration test phase.
 */
@Disabled("Integration test - requires running database")
@SpringBootTest
class RDTApplicationTests {

    @Test
    void contextLoads() {}
}
