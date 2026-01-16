package com.rdt.auth.service;

import com.rdt.auth.model.dto.LoginReq;
import com.rdt.auth.model.dto.LoginResp;

public interface AuthService {
    LoginResp login(LoginReq req);

    void logout();
}
