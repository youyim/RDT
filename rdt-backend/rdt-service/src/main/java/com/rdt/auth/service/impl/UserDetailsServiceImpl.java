package com.rdt.auth.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.rdt.auth.model.entity.SysUser;
import com.rdt.auth.repository.UserRepository;
import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Implementation of Spring Security's UserDetailsService.
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        SysUser user = userRepository.selectOne(new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, username));

        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        // Map SysUser to Spring Security UserDetails.
        return new User(
                user.getUsername(),
                user.getPassword(),
                user.getStatus() == 1, // enabled: 1=正常
                true, // accountNonExpired
                true, // credentialsNonExpired
                user.getStatus() != 2, // accountNonLocked: 2=锁定
                Collections.emptyList());
    }
}
