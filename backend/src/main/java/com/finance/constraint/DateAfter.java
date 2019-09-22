package com.finance.constraint;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

import com.finance.validator.DateAfterValidator;

@Constraint(validatedBy = DateAfterValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface DateAfter {

	String message() default "{com.finance.constraint.DateAfter.message}";
	 
    String base();
 
    String toCheck();
 
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};    
    
    @Target({ ElementType.TYPE })
    @Retention(RetentionPolicy.RUNTIME)
    @interface List {
    	DateAfter[] value();
    }
}
