package com.rdt.common.exception;

import lombok.Getter;

/**
 * 业务异常类.
 *
 * <p>用于业务逻辑校验失败时抛出，由全局异常处理器统一捕获并返回友好提示。
 */
@Getter
public class BusinessException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * HTTP 400 Bad Request
     */
    public static final int BAD_REQUEST_CODE = 400;

    /**
     * HTTP 404 Not Found
     */
    public static final int NOT_FOUND_CODE = 404;

    /**
     * HTTP 500 Internal Server Error
     */
    public static final int SERVER_ERROR_CODE = 500;

    /**
     * 业务错误码 (对应 HTTP 状态码或自定义业务码)
     */
    private final int code;

    /**
     * 构造业务异常.
     *
     * @param code 错误码
     * @param message 错误信息
     */
    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }

    /**
     * 构造业务异常 (带原因).
     *
     * @param code 错误码
     * @param message 错误信息
     * @param cause 原始异常
     */
    public BusinessException(int code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }

    /**
     * 快速创建 400 错误.
     *
     * @param message 错误信息
     * @return BusinessException
     */
    public static BusinessException badRequest(String message) {
        return new BusinessException(BAD_REQUEST_CODE, message);
    }

    /**
     * 快速创建 404 错误.
     *
     * @param message 错误信息
     * @return BusinessException
     */
    public static BusinessException notFound(String message) {
        return new BusinessException(NOT_FOUND_CODE, message);
    }

    /**
     * 快速创建 500 错误.
     *
     * @param message 错误信息
     * @return BusinessException
     */
    public static BusinessException serverError(String message) {
        return new BusinessException(SERVER_ERROR_CODE, message);
    }
}
