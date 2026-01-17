package com.rdt.auth.i18n;

import com.rdt.common.i18n.I18nKey;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * User module i18n keys.
 */
@Getter
@RequiredArgsConstructor
public enum UserMessages implements I18nKey {

    /**
     * User not found.
     */
    USER_NOT_FOUND("error.user.not.found"),

    /**
     * Delete user failed.
     */
    DELETE_FAILED("error.user.delete.failed"),

    /**
     * Reset password failed.
     */
    RESET_PASSWORD_FAILED("error.user.reset.password.failed"),

    /**
     * Username already exists.
     */
    USERNAME_ALREADY_EXISTS("error.user.username.exists"),

    /**
     * Create user failed.
     */
    CREATE_FAILED("error.user.create.failed"),

    /**
     * Update user failed.
     */
    UPDATE_FAILED("error.user.update.failed");

    private final String key;
}
