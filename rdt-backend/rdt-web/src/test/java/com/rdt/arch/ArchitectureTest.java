package com.rdt.arch;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.fields;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.methods;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.library.Architectures.layeredArchitecture;
import static com.tngtech.archunit.library.dependencies.SlicesRuleDefinition.slices;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

/**
 * 架构守护测试.
 *
 * <p>
 * 确保 AI 生成的代码不会破坏分层架构和命名规范。
 */
@AnalyzeClasses(packages = "com.rdt", importOptions = ImportOption.DoNotIncludeTests.class)
public class ArchitectureTest {

    // 1. 严格的分层架构检查
    @ArchTest
    final ArchRule layered_architecture_is_respected = layeredArchitecture()
            .consideringOnlyDependenciesInLayers()
            .optionalLayer("Controller")
            .definedBy("..controller..")
            .optionalLayer("Service")
            .definedBy("..service..")
            .optionalLayer("Repository")
            .definedBy("..mapper..", "..repository..")
            .optionalLayer("Domain")
            .definedBy("..entity..", "..domain..")
            .optionalLayer("Common")
            .definedBy("..model..", "..dto..", "..vo..", "..common..")
            .layer("Config")
            .definedBy("..config..")

            // 规则约束
            .whereLayer("Controller")
            .mayNotBeAccessedByAnyLayer()
            .whereLayer("Service")
            .mayOnlyBeAccessedByLayers("Controller", "Config")
            .whereLayer("Repository")
            .mayOnlyBeAccessedByLayers("Service") // 核心：Controller 禁止直连 Repository
            .whereLayer("Domain")
            .mayOnlyBeAccessedByLayers("Repository", "Service", "Config"); // 做法 A: Controller 禁止访问 Domain
    // (Entity)
    // (Entity)

    // 2. 命名规范：Controller 必须以 Controller 结尾
    @ArchTest
    final ArchRule controllers_should_be_named_correctly = classes()
            .that()
            .resideInAPackage("..controller..")
            .should()
            .haveSimpleNameEndingWith("Controller")
            .allowEmptyShould(true);

    // 3. 命名规范：Service 接口以 Service 结尾，实现类以 Impl 结尾
    @ArchTest
    final ArchRule services_should_be_named_correctly = classes()
            .that()
            .resideInAPackage("..service..")
            .and()
            .areInterfaces()
            .should()
            .haveSimpleNameEndingWith("Service")
            .allowEmptyShould(true);

    @ArchTest
    final ArchRule service_impls_should_be_named_correctly = classes()
            .that()
            .resideInAPackage("..service..")
            .and()
            .areNotInterfaces()
            .should()
            .haveSimpleNameEndingWith("Impl")
            .allowEmptyShould(true);

    @ArchTest
    final ArchRule service_impls_should_be_annotated_with_service = classes()
            .that()
            .resideInAPackage("..service..")
            .and()
            .areNotInterfaces()
            .should()
            .beAnnotatedWith(org.springframework.stereotype.Service.class)
            .allowEmptyShould(true)
            .because("Service implementations must be annotated with @Service.");

    // 4. 禁止 System.out.println / System.err (PMD 也有检查，这里双重保险)
    // 注意：允许 System.nanoTime() 等合法 API
    @ArchTest
    final ArchRule no_system_out = noClasses()
            .should()
            .accessField(System.class, "out")
            .orShould()
            .accessField(System.class, "err")
            .because("System.out/err is forbidden, use SLF4J loggers instead.");

    // 5. 禁止使用 java.util.Date (强制使用 Java 8 Time API)
    @ArchTest
    final ArchRule no_util_date = noClasses()
            .that()
            .haveNameNotMatching(".*JwtProvider")
            .should()
            .dependOnClassesThat()
            .haveFullyQualifiedName("java.util.Date")
            .because(
                    "java.util.Date is obsolete, use java.time.* instead. (Exemption: JwtProvider due to JJWT library requirement)");

    // 6. 禁止使用 java.util.logging (强制使用 SLF4J)
    @ArchTest
    final ArchRule no_java_util_logging = noClasses()
            .should()
            .dependOnClassesThat()
            .resideInAPackage("java.util.logging")
            .because("Use SLF4J instead of java.util.logging.");

    // 12. 异常规范：禁止 e.printStackTrace() (强制使用 Logger)
    @ArchTest
    final ArchRule no_print_stack_trace = noClasses()
            .should()
            .callMethod(Throwable.class, "printStackTrace")
            .andShould()
            .callMethod(Exception.class, "printStackTrace")
            .andShould()
            .callMethod(RuntimeException.class, "printStackTrace")
            .because("Do not use e.printStackTrace(). Use logger.error(\"msg\", e) instead.");

    // 10. 异常规范：禁止直接抛出 Generic Exception (必须使用自定义异常)
    @ArchTest
    final ArchRule no_generic_exceptions = methods()
            .that()
            .areDeclaredInClassesThat()
            .resideInAnyPackage("..controller..", "..service..", "..repository..", "..mapper..")
            .should()
            .notDeclareThrowableOfType(Exception.class)
            .andShould()
            .notDeclareThrowableOfType(RuntimeException.class)
            .andShould()
            .notDeclareThrowableOfType(Throwable.class)
            .allowEmptyShould(true)
            .because(
                    "Do not throw generic exceptions (Exception/RuntimeException/Throwable). Use Custom Business Exceptions instead.");

    // 11. 异常规范：禁止在代码中直接 new Exception() 或 new RuntimeException()
    @ArchTest
    final ArchRule no_generic_exception_instantiation = noClasses()
            .should()
            .callConstructor(Exception.class)
            .orShould()
            .callConstructor(RuntimeException.class)
            .orShould()
            .callConstructor(Throwable.class)
            .because("Instantiating generic exceptions is forbidden. Use specific subclasses or BusinessException.");

    // 13. 循环依赖检测：禁止包与包之间存在循环依赖
    @ArchTest
    final ArchRule no_cycles = slices().matching("com.rdt.(*)..").should().beFreeOfCycles();

    // =========================================================================
    // 深度规则 (Advanced Rules)
    // =========================================================================

    // 7. 领域纯净度：Controller 禁止使用 Entity (防止暴露数据库结构、循环引用和敏感字段泄露)
    // 做法 A: 强制要求在 Service 层转换 DTO
    @ArchTest
    final ArchRule controllers_should_not_depend_on_entities = noClasses()
            .that()
            .resideInAPackage("..controller..")
            .should()
            .dependOnClassesThat()
            .areAnnotatedWith("javax.persistence.Entity")
            .orShould()
            .dependOnClassesThat()
            .areAnnotatedWith("jakarta.persistence.Entity")
            .orShould()
            .dependOnClassesThat()
            .areAnnotatedWith("com.baomidou.mybatisplus.annotation.TableName")
            .because(
                    "Controllers must not use Entities directly; conversion to DTOs must happen in the Service layer (Option A).")
            .allowEmptyShould(true);

    // 8. API 契约：Controller 所有公开方法必须返回 Result<T>
    // 注意：这里放宽限制，只要返回类型简单名称包含 "Result" 即可
    @ArchTest
    final ArchRule controllers_should_return_result_wrapper = methods()
            .that()
            .arePublic()
            .and()
            .areDeclaredInClassesThat()
            .resideInAPackage("..controller..")
            .should()
            .haveRawReturnType(com.rdt.common.Result.class)
            .allowEmptyShould(true)
            .because("API must return unified wrapper 'Result<T>'.");

    // 14. 校验规则：POST/PUT 请求的 @RequestBody 参数必须带有 @Valid
    // 注意：ArchUnit 对参数注解的检查在不同版本行为略有差异，这里确保逻辑严密
    @ArchTest
    final ArchRule controller_parameters_should_be_validated = methods()
            .that()
            .areDeclaredInClassesThat()
            .resideInAPackage("..controller..")
            .and()
            .arePublic()
            .should(
                    new com.tngtech.archunit.lang.ArchCondition<com.tngtech.archunit.core.domain.JavaMethod>(
                            "be validated") {
                        @Override
                        public void check(
                                com.tngtech.archunit.core.domain.JavaMethod method,
                                com.tngtech.archunit.lang.ConditionEvents events) {
                            method.getParameters().forEach(parameter -> {
                                boolean hasRequestBody = parameter.isAnnotatedWith(
                                        org.springframework.web.bind.annotation.RequestBody.class);
                                boolean hasValid = parameter.isAnnotatedWith("jakarta.validation.Valid")
                                        || parameter.isAnnotatedWith("javax.validation.Valid");
                                if (hasRequestBody && !hasValid) {
                                    events.add(com.tngtech.archunit.lang.SimpleConditionEvent.violated(
                                            method,
                                            String.format(
                                                    "Method %s has @RequestBody parameter without @Valid",
                                                    method.getFullName())));
                                }
                            });
                        }
                    })
            .because("All @RequestBody parameters must be annotated with @Valid for validation.")
            .allowEmptyShould(true);

    // 15. 安全规则：所有 Controller 公开方法必须带有安全注解 (@PreAuthorize, @Secured, @PermitAll 等)
    @ArchTest
    final ArchRule controller_methods_should_be_secured = methods()
            .that()
            .arePublic()
            .and()
            .areDeclaredInClassesThat()
            .resideInAPackage("..controller..")
            .should()
            .beAnnotatedWith("org.springframework.security.access.prepost.PreAuthorize")
            .orShould()
            .beAnnotatedWith("org.springframework.security.access.annotation.Secured")
            .orShould()
            .beAnnotatedWith("jakarta.annotation.security.PermitAll")
            .orShould()
            .beAnnotatedWith("jakarta.annotation.security.RolesAllowed")
            .orShould()
            .beAnnotatedWith("javax.annotation.security.PermitAll")
            .allowEmptyShould(true) // 初始项目可能没配 Spring Security
            .because(
                    "All public controller methods must have a security annotation (@PreAuthorize, @PermitAll, etc.).");

    // 16. 事务边界：不允许在 Controller 层使用 @Transactional (强制在 Service 层处理)
    @ArchTest
    final ArchRule no_transactional_in_controllers = classes()
            .that()
            .resideInAPackage("..controller..")
            .should()
            .notBeAnnotatedWith("org.springframework.transaction.annotation.Transactional")
            .andShould()
            .notBeAnnotatedWith("jakarta.transaction.Transactional")
            .andShould()
            .notBeAnnotatedWith("javax.transaction.Transactional")
            .because("Transactions must be handled at the Service layer, not in Controllers.")
            .allowEmptyShould(true);

    @ArchTest
    final ArchRule no_transactional_methods_in_controllers = methods()
            .that()
            .areDeclaredInClassesThat()
            .resideInAPackage("..controller..")
            .should()
            .notBeAnnotatedWith("org.springframework.transaction.annotation.Transactional")
            .andShould()
            .notBeAnnotatedWith("jakarta.transaction.Transactional")
            .andShould()
            .notBeAnnotatedWith("javax.transaction.Transactional")
            .because("Transactional annotations on methods are forbidden in the Controller layer.")
            .allowEmptyShould(true);

    // 17. Web 层依赖清理：禁止 Controller 访问具体的持久化基础设施 (EntityManager, JdbcTemplate 等)
    @ArchTest
    final ArchRule controllers_should_not_access_persistence_infrastructure = noClasses()
            .that()
            .resideInAPackage("..controller..")
            .should()
            .dependOnClassesThat()
            .haveFullyQualifiedName("javax.persistence.EntityManager")
            .orShould()
            .dependOnClassesThat()
            .haveFullyQualifiedName("jakarta.persistence.EntityManager")
            .orShould()
            .dependOnClassesThat()
            .haveFullyQualifiedName("org.springframework.jdbc.core.JdbcTemplate")
            .orShould()
            .dependOnClassesThat()
            .haveFullyQualifiedName("org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate")
            .orShould()
            .dependOnClassesThat()
            .haveFullyQualifiedName("org.hibernate.Session")
            .orShould()
            .dependOnClassesThat()
            .haveFullyQualifiedName("com.baomidou.mybatisplus.core.mapper.BaseMapper")
            .because(
                    "Controllers should not access persistence infrastructure directly (EntityManager, JdbcTemplate, etc.).")
            .allowEmptyShould(true);

    // 18. API 文档规范：所有公开的 Controller 方法必须带有 Swagger 注解 (@Operation)
    @ArchTest
    final ArchRule controllers_should_have_documentation = methods()
            .that()
            .arePublic()
            .and()
            .areDeclaredInClassesThat()
            .resideInAPackage("..controller..")
            .should()
            .beAnnotatedWith("io.swagger.v3.oas.annotations.Operation")
            .orShould()
            .beAnnotatedWith("io.swagger.v3.oas.annotations.tags.Tag")
            .allowEmptyShould(true) // 初始项目可能没配 Swagger
            .because("All public APIs should be documented via Swagger/OpenAPI annotations.");

    // 19. 依赖注入规范：禁止字段注入 (@Autowired)，强制使用构造器注入
    @ArchTest
    final ArchRule no_field_injection = fields().that()
            .areDeclaredInClassesThat()
            .resideInAnyPackage("..controller..", "..service..")
            .should()
            .notBeAnnotatedWith("org.springframework.beans.factory.annotation.Autowired")
            .andShould()
            .notBeAnnotatedWith("jakarta.annotation.Resource")
            .allowEmptyShould(true)
            .because("Always use constructor injection with @RequiredArgsConstructor + final fields.");

    // 20. 控制器规范：强制使用 @RestController 而非 @Controller
    @ArchTest
    final ArchRule controllers_should_be_rest_controllers = classes()
            .that()
            .resideInAPackage("..controller..")
            .and()
            .areNotInterfaces()
            .and()
            .haveSimpleNameEndingWith("Controller")
            .should()
            .beAnnotatedWith("org.springframework.web.bind.annotation.RestController")
            .andShould()
            .notBeAnnotatedWith("org.springframework.stereotype.Controller")
            .allowEmptyShould(true)
            .because("Modern REST APIs should use @RestController to simplify code and avoid redundant @ResponseBody.");

    // 21. 参数校验规范：所有 Controller 类必须带有 @Validated 注解
    @ArchTest
    final ArchRule controllers_should_be_validated = classes()
            .that()
            .resideInAPackage("..controller..")
            .and()
            .areNotInterfaces()
            .and()
            .haveSimpleNameEndingWith("Controller")
            .should()
            .beAnnotatedWith("org.springframework.validation.annotation.Validated")
            .allowEmptyShould(true)
            .because("Enable class-level validation for method parameters and group validation.");

    // 22. 并发安全规范：Service 和 Controller 必须是无状态单例 (Stateless Singleton)
    // 强制所有成员变量必须是 final 的 (除了 static 字段通常是常量，也建议 final)
    @ArchTest
    final ArchRule stateless_singletons = fields().that()
            .areDeclaredInClassesThat()
            .resideInAnyPackage("..controller..", "..service..")
            .should()
            .beFinal()
            .allowEmptyShould(true)
            .because(
                    "Controllers and Services must be stateless singletons. All fields must be final (Constructor Injection).");

    // 23. 事务一致性：@Transactional 必须只出现在 public 方法上 (Spring AOP 限制)
    @ArchTest
    final ArchRule transactional_methods_must_be_public = methods()
            .that()
            .areAnnotatedWith("org.springframework.transaction.annotation.Transactional")
            .or()
            .areAnnotatedWith("jakarta.transaction.Transactional")
            .should()
            .bePublic()
            .allowEmptyShould(true)
            .because(
                    "Spring AOP only proxies public methods. Private/Protected @Transactional methods are silently ignored.");

    // 24. 异步安全：@Async 方法必须返回 CompletableFuture/Future（防止异常静默丢失）
    @ArchTest
    final ArchRule async_methods_should_return_future = methods()
            .that()
            .areAnnotatedWith("org.springframework.scheduling.annotation.Async")
            .should()
            .haveRawReturnType(java.util.concurrent.CompletableFuture.class)
            .orShould()
            .haveRawReturnType(java.util.concurrent.Future.class)
            .allowEmptyShould(true)
            .because(
                    "@Async void methods silently swallow exceptions. Return CompletableFuture to enable exception handling.");
}
