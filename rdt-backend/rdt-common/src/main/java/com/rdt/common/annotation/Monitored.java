package com.rdt.common.annotation;

import java.lang.annotation.*;

/**
 * 监控埋点注解. 标记在方法上，自动记录执行耗时(Timer)和调用次数(Counter)。
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Monitored {
    /** 埋点名称 (metric name). */
    String value() default "";

    /** 描述信息. */
    String description() default "";
}
