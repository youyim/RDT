package com.rdt.web.aspect;

import com.rdt.common.annotation.Monitored;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * 监控切面. 基于 Micrometer 记录 @Monitored 方法的执行指标.
 */
@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class MonitoringAspect {

    private final MeterRegistry meterRegistry;

    // 缓存 Timer 避免重复构建
    private final ConcurrentMap<String, Timer> timerCache = new ConcurrentHashMap<>();

    private static final long SLOW_EXECUTION_THRESHOLD_NS = 1_000_000_000L; // 1 second
    private static final long NS_TO_MS_DIVISOR = 1_000_000L;

    @Around("@annotation(monitored) || @within(monitored)")
    public Object interact(ProceedingJoinPoint joinPoint, Monitored monitored) throws Throwable {
        Monitored effectiveMonitored = monitored;
        if (effectiveMonitored == null) {
            // 尝试获取类上的注解
            effectiveMonitored = joinPoint.getTarget().getClass().getAnnotation(Monitored.class);
        }

        if (effectiveMonitored == null) {
            return joinPoint.proceed();
        }

        long start = System.nanoTime();
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        String metricName =
                StringUtils.hasText(effectiveMonitored.value()) ? effectiveMonitored.value() : "method.execution";

        try {
            return joinPoint.proceed();
        } finally {
            long duration = System.nanoTime() - start;
            Timer timer = getTimer(metricName, className, methodName, effectiveMonitored.description());
            timer.record(Duration.ofNanos(duration));

            // 记录慢调用日志 (可选: > 1000ms)
            if (duration > SLOW_EXECUTION_THRESHOLD_NS) {
                log.warn("Slow method execution: {}.{} took {} ms", className, methodName, duration / NS_TO_MS_DIVISOR);
            }
        }
    }

    private Timer getTimer(String name, String className, String methodName, String description) {
        String key = name + ":" + className + ":" + methodName;
        return timerCache.computeIfAbsent(key, k -> Timer.builder(name)
                .description(description)
                .tag("class", className)
                .tag("method", methodName)
                .register(meterRegistry));
    }
}
