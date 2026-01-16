package com.rdt.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 统一响应类.
 *
 * <p>所有后端接口统一返回此格式，便于前端统一处理和 AI 协作。
 *
 * @param <T> 数据载体类型
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Result<T> {

    /**
     * 状态码
     * <ul>
     *   <li>200 - 成功</li>
     *   <li>400 - 请求参数错误</li>
     *   <li>401 - 未授权</li>
     *   <li>403 - 禁止访问</li>
     *   <li>404 - 资源不存在</li>
     *   <li>500 - 服务器内部错误</li>
     * </ul>
     */
    private int code;

    /**
     * 提示信息
     */
    private String message;

    /**
     * 数据载体
     */
    private T data;

    /**
     * 响应时间戳 (ISO 8601 格式)
     */
    private String timestamp;

    /**
     * 成功状态码 (200)
     */
    public static final int SUCCESS_CODE = 200;

    /**
     * 默认错误状态码 (500)
     */
    public static final int ERROR_CODE = 500;

    /**
     * 成功响应（带数据）
     */
    public static <T> Result<T> success(T data) {
        return Result.<T>builder()
                .code(SUCCESS_CODE)
                .message("success")
                .data(data)
                .timestamp(now())
                .build();
    }

    /**
     * 成功响应（无数据）
     */
    public static <T> Result<T> success() {
        return success(null);
    }

    /**
     * 成功响应（自定义消息）
     */
    public static <T> Result<T> success(String message, T data) {
        return Result.<T>builder()
                .code(SUCCESS_CODE)
                .message(message)
                .data(data)
                .timestamp(now())
                .build();
    }

    /**
     * 失败响应
     */
    public static <T> Result<T> error(int code, String message) {
        return Result.<T>builder().code(code).message(message).timestamp(now()).build();
    }

    /**
     * 失败响应（默认 500）
     */
    public static <T> Result<T> error(String message) {
        return error(ERROR_CODE, message);
    }

    /**
     * 获取当前时间戳（ISO 8601 格式）
     */
    private static String now() {
        return DateTimeFormatter.ISO_INSTANT.format(Instant.now());
    }
}
