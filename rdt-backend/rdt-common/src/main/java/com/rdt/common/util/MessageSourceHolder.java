package com.rdt.common.util;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.MessageSource;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

/**
 * Spring 容器感知持有类，用于在静态上下文中访问 MessageSource.
 */
@Component
public class MessageSourceHolder implements ApplicationContextAware {

    private static MessageSource messageSource;

    @Override
    @SuppressWarnings("java:S2696") // Static field set from instance method: Spring ApplicationContextAware pattern
    public void setApplicationContext(@NonNull ApplicationContext applicationContext) {
        MessageSourceHolder.messageSource = applicationContext.getBean(MessageSource.class);
    }

    /* default */ static MessageSource getMessageSource() {
        return messageSource;
    }
}
