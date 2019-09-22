package com.finance.validator;

import java.util.Date;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.ValidationException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanWrapperImpl;

import com.finance.constraint.DateAfter;

public class DateAfterValidator implements ConstraintValidator<DateAfter, Object> {

	private final static Logger logger = LoggerFactory.getLogger(DateAfterValidator.class);

	private String base;
	private String toCheck;

	public void initialize(DateAfter constraintAnnotation) {
		this.base = constraintAnnotation.base();
		this.toCheck = constraintAnnotation.toCheck();
	}

	@Override
	public boolean isValid(Object value, ConstraintValidatorContext context) {

		Object baseValue = new BeanWrapperImpl(value).getPropertyValue(base);
		Object toCheckValue = new BeanWrapperImpl(value).getPropertyValue(toCheck);
		
		logger.debug("Verifying if the date {} ({}) is after the date {} ({})...", toCheck, toCheckValue, base, baseValue);

		if( baseValue == null || toCheckValue == null ) {
			logger.debug("Dates are valid, either {} or {} is null", base, toCheck);
			return true;
		}
		
		if( !(baseValue instanceof Date) ) {
			throw new ValidationException(String.format("The type of %s is not supporte. It should be java.util.Date.", base));
		}
		
		if( !(toCheckValue instanceof Date) ) {
			throw new ValidationException(String.format("The type of %s is not supporte. It should be java.util.Date.", toCheck));
		}
		
		Date baseDate = (Date) baseValue;
		Date toCheckDate = (Date) toCheckValue;
		
		return baseDate.equals(toCheckDate) || baseDate.before(toCheckDate);
	}
}