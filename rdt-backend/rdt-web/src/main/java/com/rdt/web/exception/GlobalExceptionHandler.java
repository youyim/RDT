package com.rdt.web.exception;

import com.rdt.common.Result;
import com.rdt.common.exception.BusinessException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

/**
 * 全局异常处理器.
 *
 * <p>统一捕获并处理所有 Controller 层抛出的异常，返回标准 Result 格式响应。
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ==================== 业务异常 ====================

    /**
     * 处理业务异常.
     *
     * @param exception 业务异常
     * @return 统一响应
     */
    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException exception) {
        log.warn("Business exception: code={}, message={}", exception.getCode(), exception.getMessage());
        return Result.error(exception.getCode(), exception.getMessage());
    }

    // ==================== 参数校验异常 ====================

    /**
     * 处理 @Valid 校验失败 (RequestBody).
     *
     * @param exception 校验异常
     * @return 统一响应
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleMethodArgumentNotValid(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .findFirst()
                .orElse("Parameter validation failed");
        log.warn("Validation failed: {}", message);
        return Result.error(HttpStatus.BAD_REQUEST.value(), message);
    }

    /**
     * 处理 @Validated 校验失败 (PathVariable, RequestParam).
     *
     * @param exception 校验异常
     * @return 统一响应
     */
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleConstraintViolation(ConstraintViolationException exception) {
        String message = exception.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining(", "));
        log.warn("Constraint violation: {}", message);
        return Result.error(HttpStatus.BAD_REQUEST.value(), message);
    }

    /**
     * 处理缺少请求参数.
     *
     * @param exception 异常
     * @return 统一响应
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleMissingServletRequestParameter(MissingServletRequestParameterException exception) {
        String message = String.format("Missing required parameter: %s", exception.getParameterName());
        log.warn(message);
        return Result.error(HttpStatus.BAD_REQUEST.value(), message);
    }

    /**
     * 处理参数类型不匹配.
     *
     * @param exception 异常
     * @return 统一响应
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException exception) {
        String message = String.format("Parameter type mismatch: %s", exception.getName());
        log.warn(message);
        return Result.error(HttpStatus.BAD_REQUEST.value(), message);
    }

    // ==================== HTTP 请求异常 ====================

    /**
     * 处理请求体解析失败.
     *
     * @param exception 异常
     * @return 统一响应
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleHttpMessageNotReadable(HttpMessageNotReadableException exception) {
        log.warn("Request body parse error: {}", exception.getMessage());
        return Result.error(HttpStatus.BAD_REQUEST.value(), "Invalid request body format");
    }

    /**
     * 处理不支持的请求方法.
     *
     * @param exception 异常
     * @return 统一响应
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    public Result<Void> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException exception) {
        log.warn("Method not supported: {}", exception.getMethod());
        return Result.error(HttpStatus.METHOD_NOT_ALLOWED.value(), "Request method not supported");
    }

    /**
     * 处理不支持的媒体类型.
     *
     * @param exception 异常
     * @return 统一响应
     */
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    @ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
    public Result<Void> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException exception) {
        log.warn("Media type not supported: {}", exception.getContentType());
        return Result.error(HttpStatus.UNSUPPORTED_MEDIA_TYPE.value(), "Media type not supported");
    }

    /**
     * 处理 404 路径不存在.
     *
     * @param exception 异常
     * @return 统一响应
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Result<Void> handleNoHandlerFound(NoHandlerFoundException exception) {
        log.warn("Handler not found: {} {}", exception.getHttpMethod(), exception.getRequestURL());
        return Result.error(HttpStatus.NOT_FOUND.value(), "Resource not found");
    }

    // ==================== 系统异常 (兜底) ====================

    /**
     * 处理所有未捕获的异常.
     *
     * @param exception 异常
     * @return 统一响应
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @SuppressWarnings("PMD.AvoidCatchingGenericException")
    public Result<Void> handleException(Exception exception) {
        log.error("Unexpected system error", exception);
        return Result.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "System error, please try again later");
    }
}
