package com.rdt.common.util;

import java.util.Locale;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

/**
 * 国际化消息工具类 (纯静态工具类).
 */
@Slf4j
public final class MessageUtils {

    private MessageUtils() {
        // Prevent instantiation
    }

    /**
     * 获取当前语言环境下的消息.
     *
     * <p>使用 {@code getMessage(code, args, defaultMessage, locale)} 方法，
     * 当找不到 key 时会返回 defaultMessage (即 code 本身)，不会抛出异常。
     *
     * @param code 消息键 (e.g. "error.param")
     * @param args 参数
     * @return localized message, or the code itself if not found
     */
    public static String get(String code, Object... args) {
        MessageSource messageSource = MessageSourceHolder.getMessageSource();
        if (messageSource == null) {
            // Fallback if Spring context not initialized
            return code;
        }
        Locale locale = LocaleContextHolder.getLocale();
        // 第三个参数 code 作为 defaultMessage，确保不会抛出 NoSuchMessageException
        return messageSource.getMessage(code, args, code, locale);
    }
}
