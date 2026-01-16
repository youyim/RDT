package com.rdt.common.constant;

/**
 * 链路追踪常量.
 */
public final class TraceConstants {

    /** MDC key & Header key for Trace ID. */
    public static final String TRACE_ID_KEY = "traceId";

    /** Default MDC key (Logback standard). */
    public static final String LOG_TRACE_ID = "trace_id";

    private TraceConstants() {
        // Prevent instantiation
    }
}
