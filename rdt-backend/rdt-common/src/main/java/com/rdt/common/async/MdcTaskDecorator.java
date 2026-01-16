package com.rdt.common.async;

import java.util.Map;
import org.slf4j.MDC;
import org.springframework.core.task.TaskDecorator;
import org.springframework.lang.NonNull;

/**
 * MDC 线程上下文传递装饰器. 用于在线程池异步执行时透传 TraceID。
 */
public class MdcTaskDecorator implements TaskDecorator {
    @Override
    @NonNull public Runnable decorate(@NonNull Runnable runnable) {
        // 捕获当前线程的 MDC 上下文
        Map<String, String> contextMap = MDC.getCopyOfContextMap();
        return () -> {
            try {
                // 在子线程恢复上下文
                if (contextMap != null) {
                    MDC.setContextMap(contextMap);
                }
                runnable.run();
            } finally {
                // 清理，防止线程复用导致污染
                MDC.clear();
            }
        };
    }
}
