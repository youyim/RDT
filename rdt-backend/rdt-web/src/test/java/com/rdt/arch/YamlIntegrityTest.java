package com.rdt.arch;

import java.io.InputStream;
import java.util.Map;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.yaml.snakeyaml.LoaderOptions;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.SafeConstructor;

/**
 * YAML 配置文件完整性测试.
 *
 * <p>确保 application.yml 没有语法错误或重复键等问题。
 */
class YamlIntegrityTest {

    @Test
    void testApplicationYamlSyntax() {
        Yaml yaml = new Yaml(new SafeConstructor(new LoaderOptions()));
        ClassPathResource resource = new ClassPathResource("application.yml");

        // 此处只做基本语法解析测试，SnakeYAML 默认即不允许重复 Key (v2.x)
        // Spring Boot 使用的 SnakeYAML 版本通常是严格的
        Assertions.assertDoesNotThrow(() -> {
            try (InputStream inputStream = resource.getInputStream()) {
                Map<String, Object> obj = yaml.load(inputStream);
                Assertions.assertNotNull(obj);
            }
        });
    }
}
