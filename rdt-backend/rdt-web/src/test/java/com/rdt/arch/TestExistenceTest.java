package com.rdt.arch;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;

import com.tngtech.archunit.core.domain.JavaClass;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchCondition;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.lang.ConditionEvents;
import com.tngtech.archunit.lang.SimpleConditionEvent;

/**
 * 测试存在性校验.
 * 强制要求所有 Service 和 Controller 必须有对应的测试类。
 */
@AnalyzeClasses(packages = "com.rdt")
public class TestExistenceTest {

    @ArchTest
    static final ArchRule logic_classes_should_have_tests = classes()
            .that()
            .resideInAPackage("..service..")
            .or()
            .resideInAPackage("..controller..")
            .and()
            .areNotInterfaces()
            .and()
            .haveSimpleNameNotEndingWith("Test")
            .should(new ArchCondition<JavaClass>("have a corresponding test class") {
                @Override
                public void check(JavaClass item, ConditionEvents events) {
                    String testClassName = item.getName() + "Test";
                    // ArchUnit 扫描时如果包含测试类，我们可以通过 item.getPackage().getClasses() 或全局查找
                    // 但最简单可靠的方式依然是尝试加载该类（Junit 运行环境下 test-classes 在 classpath 中）
                    try {
                        Class.forName(testClassName);
                    } catch (ClassNotFoundException e) {
                        events.add(SimpleConditionEvent.violated(
                                item,
                                String.format(
                                        "Class %s does not have a corresponding test class %s",
                                        item.getName(), testClassName)));
                    }
                }
            })
            .because("Every Service and Controller must have a corresponding unit test class to ensure quality.")
            .allowEmptyShould(true);
}
