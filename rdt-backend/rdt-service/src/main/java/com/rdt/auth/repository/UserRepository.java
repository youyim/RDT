package com.rdt.auth.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.rdt.auth.model.entity.SysUser;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserRepository extends BaseMapper<SysUser> {}
