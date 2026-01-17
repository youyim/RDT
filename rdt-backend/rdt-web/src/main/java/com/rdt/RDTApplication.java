package com.rdt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * RDT 应用启动入口
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class RDTApplication {

    public static void main(String[] args) {
        SpringApplication.run(RDTApplication.class, args);
    }
}
