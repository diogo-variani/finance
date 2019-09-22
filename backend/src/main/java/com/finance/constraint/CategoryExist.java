package com.finance.constraint;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

import com.finance.validator.CategoryExistValidator;

@Documented
@Constraint(validatedBy = CategoryExistValidator.class)
@Target( { ElementType.METHOD, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface CategoryExist {

	String message() default "{com.finance.constraint.CategoryExist.message}";
	
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
}
