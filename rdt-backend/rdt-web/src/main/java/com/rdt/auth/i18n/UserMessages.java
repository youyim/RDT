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
    USER_NOT_FOUND("error.user.not.found");

    private final String key;
}
