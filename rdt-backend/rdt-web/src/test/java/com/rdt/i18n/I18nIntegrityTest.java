package com.rdt.i18n;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

/**
 * 国际化完整性测试.
 * <p>
 * 确保所有语言资源文件的 Key 保持一致，防止遗漏。
 */
class I18nIntegrityTest {

    private static final Logger log = LoggerFactory.getLogger(I18nIntegrityTest.class);
    private static final String BASE_PATH = "i18n";
    private static final String DEFAULT_FILE = "messages.properties";

    @Test
    void testI18nKeysConsistency() throws IOException {
        // 1. Ensure resource directory exists
        ClassPathResource resourceDir = new ClassPathResource(BASE_PATH);
        assertTrue(resourceDir.exists(), "I18n resource directory not found: " + BASE_PATH);

        // 2. Load baseline keys
        Set<String> baseKeys = loadKeys(DEFAULT_FILE);
        log.info("Baseline keys ({}): {}", DEFAULT_FILE, baseKeys.size());

        // 3. Scan for all messages_*.properties files
        File dir = resourceDir.getFile();
        File[] targetFiles = dir.listFiles((d, name) -> name.startsWith("messages_") && name.endsWith(".properties"));
        assertNotNull(targetFiles, "Failed to list translation files");

        for (File file : targetFiles) {
            String fileName = file.getName();
            Set<String> targetKeys = loadKeys(fileName);
            log.info("Checking translation file [{}], keys: {}", fileName, targetKeys.size());

            // 3.1 Check missing Keys (In Source, not in Target)
            Set<String> missingInTarget = new HashSet<>(baseKeys);
            missingInTarget.removeAll(targetKeys);

            // 3.2 Check extra Keys (In Target, not in Source)
            Set<String> extraInTarget = new HashSet<>(targetKeys);
            extraInTarget.removeAll(baseKeys);

            assertTrue(
                    missingInTarget.isEmpty(),
                    String.format("File [%s] is missing keys defined in baseline: %s", fileName, missingInTarget));
            assertTrue(
                    extraInTarget.isEmpty(),
                    String.format("File [%s] has extra keys not in baseline: %s", fileName, extraInTarget));
        }
    }

    @Test
    void testI18nKeysCompletenessInCode() throws IOException {
        // 1. Get all keys from baseline
        Set<String> propertyKeys = loadKeys(DEFAULT_FILE);

        // 2. Scan for I18nKey implementations (hardcoded for now as we know
        // UserMessages exists)
        // In a larger project, using ClassGraph/Reflections would be better.
        Set<String> codeKeys = new HashSet<>();
        codeKeys.addAll(getEnumKeys(com.rdt.auth.i18n.UserMessages.class));

        // 3. Verify every key in code exists in property file
        Set<String> missingInResource = new HashSet<>(codeKeys);
        missingInResource.removeAll(propertyKeys);

        assertTrue(
                missingInResource.isEmpty(),
                String.format(
                        "The following keys defined in Java Code are missing in [%s]: %s",
                        DEFAULT_FILE, missingInResource));
    }

    private Set<String> loadKeys(String fileName) throws IOException {
        Properties props = new Properties();
        ClassPathResource resource = new ClassPathResource(BASE_PATH + "/" + fileName);
        assertTrue(resource.exists(), "Property file not found: " + fileName);
        try (InputStream is = resource.getInputStream()) {
            props.load(is);
        }
        return props.stringPropertyNames();
    }

    private <T extends Enum<T> & com.rdt.common.i18n.I18nKey> Set<String> getEnumKeys(Class<T> enumClass) {
        Set<String> keys = new HashSet<>();
        for (T constant : enumClass.getEnumConstants()) {
            keys.add(constant.getKey());
        }
        return keys;
    }
}
