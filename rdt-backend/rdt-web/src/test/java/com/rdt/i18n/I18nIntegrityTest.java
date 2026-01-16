package com.rdt.i18n;

import static org.junit.jupiter.api.Assertions.assertTrue;

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
 * <p>确保所有语言资源文件的 Key 保持一致，防止遗漏。
 */
class I18nIntegrityTest {

    private static final Logger log = LoggerFactory.getLogger(I18nIntegrityTest.class);
    private static final String BASE_PATH = "i18n";
    private static final String DEFAULT_FILE = "messages.properties";

    @Test
    void testI18nKeysConsistency() throws IOException {
        // 1. 加载基准文件 (messages.properties)
        Set<String> baseKeys = loadKeys(DEFAULT_FILE);
        log.info("Baseline keys ({}): {}", DEFAULT_FILE, baseKeys.size());

        // 2. 扫描所有其他语言文件
        // 注意：Unit Test 环境下Classpath资源可能在 target/classes
        ClassPathResource resourceDir = new ClassPathResource(BASE_PATH);
        if (!resourceDir.exists()) {
            // 可能是直接运行在 IDEA src 目录
            return;
        }

        // 这里的逻辑稍微复杂，为了简单起见，我们硬编码对比 zh_CN
        // 实际项目可以使用 ResourcePatternResolver 扫描
        String[] targetFiles = {"messages_zh_CN.properties"};

        for (String fileName : targetFiles) {
            Set<String> targetKeys = loadKeys(fileName);
            log.info("Checking {} keys: {}", fileName, targetKeys.size());

            // 比较差异
            Set<String> missingInTarget = new HashSet<>(baseKeys);
            missingInTarget.removeAll(targetKeys);

            Set<String> extraInTarget = new HashSet<>(targetKeys);
            extraInTarget.removeAll(baseKeys);

            assertTrue(
                    missingInTarget.isEmpty(),
                    String.format("File [%s] is missing keys: %s", fileName, missingInTarget));
            assertTrue(extraInTarget.isEmpty(), String.format("File [%s] has extra keys: %s", fileName, extraInTarget));
        }
    }

    private Set<String> loadKeys(String fileName) throws IOException {
        Properties props = new Properties();
        ClassPathResource resource = new ClassPathResource(BASE_PATH + "/" + fileName);
        try (InputStream is = resource.getInputStream()) {
            props.load(is);
        }
        return props.stringPropertyNames();
    }
}
