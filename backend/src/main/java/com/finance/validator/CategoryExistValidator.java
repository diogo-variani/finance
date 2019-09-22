package com.finance.validator;

import java.util.Optional;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.finance.constraint.CategoryExist;
import com.finance.domain.Category;
import com.finance.repository.CategoryRepository;

public class CategoryExistValidator implements ConstraintValidator<CategoryExist, String> {

	private final static Logger logger = LoggerFactory.getLogger(CategoryExistValidator.class);

	@Autowired
	private CategoryRepository categoryRepository;

	@Override
	public boolean isValid(String id, ConstraintValidatorContext context) {

		logger.debug("Veryfing if the category {} exists...", id);

		if (id == null) {
			logger.warn("The category id provided is null...");
			return true;
		}

		Optional<Category> optional = categoryRepository.findById(id);

		if (optional.isPresent()) {
			logger.debug("The category id provided exists...", id);
		} else {
			logger.error("The category id provided does not exist...", id);
		}

		return optional.isPresent();
	}
}