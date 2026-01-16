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
 * 测试存在性校验 (Service 层).
 * 强制要求所有 Service 必须有对应的测试类。
 */
@AnalyzeClasses(packages = "com.rdt.auth.service")
public class TestExistenceTest {

    @ArchTest
    static final ArchRule logic_classes_should_have_tests = classes()
            .that()
            .resideInAPackage("..service..")
            .and()
            .areNotInterfaces()
            .and()
            .haveSimpleNameNotEndingWith("Test")
            .should(new ArchCondition<JavaClass>("have a corresponding test class") {
                @Override
                public void check(JavaClass item, ConditionEvents events) {
                    String testClassName = item.getName() + "Test";
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
            .because("Every Service must have a corresponding unit test class in this module.")
            .allowEmptyShould(true);
}
