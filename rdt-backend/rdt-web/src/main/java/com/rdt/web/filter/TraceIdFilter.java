package com.rdt.web.filter;

import com.rdt.common.constant.TraceConstants;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * 链路追踪过滤器. 负责生成或传递 TraceID，并放入 MDC 和 响应头。
 */
@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10) // 在字符编码Filter之后
public class TraceIdFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;

        try {
            // 1. 获取或生成 TraceID
            String traceId = req.getHeader(TraceConstants.TRACE_ID_KEY);
            if (!StringUtils.hasText(traceId)) {
                traceId = UUID.randomUUID().toString().replace("-", "");
            }

            // 2. 放入 MDC
            MDC.put(TraceConstants.TRACE_ID_KEY, traceId);
            MDC.put(TraceConstants.LOG_TRACE_ID, traceId);

            // 3. 放入响应头 (方便前端查看)
            resp.setHeader(TraceConstants.TRACE_ID_KEY, traceId);

            chain.doFilter(request, response);
        } finally {
            // 4. 清理 MDC
            MDC.clear();
        }
    }
}
