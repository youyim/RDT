package com.rdt.config;

import com.rdt.common.async.MdcTaskDecorator;
import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/**
 * 线程池配置. 配置 @Async 默认线程池，并集成 MDC 透传。
 */
@EnableAsync
@Configuration
public class ThreadPoolConfig implements AsyncConfigurer {

    private static final int CORE_POOL_SIZE = 10;
    private static final int MAX_POOL_SIZE = 50;
    private static final int QUEUE_CAPACITY = 200;
    private static final int KEEP_ALIVE_SECONDS = 60;

    @Override
    @Bean("taskExecutor")
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(CORE_POOL_SIZE); // 核心线程数
        executor.setMaxPoolSize(MAX_POOL_SIZE); // 最大线程数
        executor.setQueueCapacity(QUEUE_CAPACITY); // 队列容量
        executor.setKeepAliveSeconds(KEEP_ALIVE_SECONDS);
        executor.setThreadNamePrefix("rdt-async-");

        // 关键：设置任务装饰器，用于透传 MDC TraceID
        executor.setTaskDecorator(new MdcTaskDecorator());

        // 拒绝策略：调用者执行 (防止丢失任务)
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());

        executor.initialize();
        return executor;
    }
}
