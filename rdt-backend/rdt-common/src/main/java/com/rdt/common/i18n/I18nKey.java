package com.rdt.common.i18n;

/**
 * Internationalization Key Interface. Implement this interface (typically in
 * Enums) to provide type-safe i18n keys.
 */
public interface I18nKey {

    /**
     * Get the i18n key string (e.g., "error.user.not.found").
     *
     * @return the i18n key
     */
    String getKey();
}
