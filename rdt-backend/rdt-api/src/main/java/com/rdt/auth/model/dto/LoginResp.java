package com.rdt.auth.model.dto;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SuppressWarnings({"PMD.ShortVariable", "PMD.LinguisticNaming"})
@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
public class LoginResp implements Serializable {
    private static final long serialVersionUID = 1L;

    private String token;
    private Long expiresIn;
    private UserInfo user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
    public static class UserInfo implements Serializable {
        private static final long serialVersionUID = 1L;

        private Long id;
        private String username;
        private Integer status;
    }
}
