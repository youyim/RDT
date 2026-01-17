package com.rdt.config.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <p>
 * 主系统配置表
 * </p>
 *
 * @author AI Assistant
 * @since 2026-01-17
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("sys_main_system")
public class MainSystemEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 系统名称
     */
    @TableField("name")
    private String name;

    /**
     * 系统编码
     */
    @TableField("code")
    private String code;

    /**
     * 系统描述
     */
    @TableField("description")
    private String description;

    /**
     * 负责人
     */
    @TableField("owner")
    private String owner;

    /**
     * 状态: 1=启用, 0=禁用
     */
    @TableField("status")
    private Integer status;

    /**
     * 创建时间
     */
    @TableField("created_at")
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @TableField("updated_at")
    private LocalDateTime updatedAt;

    /**
     * 删除时间
     */
    @TableLogic(value = "NULL", delval = "NOW()")
    @TableField("deleted_at")
    private LocalDateTime deletedAt;
}
