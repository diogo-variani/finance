package com.finance.validator;

import java.util.Optional;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.finance.constraint.CreditCardExist;
import com.finance.domain.CreditCard;
import com.finance.repository.CreditCardRepository;

public class CreditCardExistValidator implements ConstraintValidator<CreditCardExist, String> {

	private final static Logger logger = LoggerFactory.getLogger(CreditCardExistValidator.class);

	@Autowired
	private CreditCardRepository creditCardRepository;

	@Override
	public boolean isValid(String id, ConstraintValidatorContext context) {

		logger.debug("Veryfing if the credit card {} exists...", id);

		if (id == null) {
			logger.warn("The credit card id provided is null...");
			return true;
		}

		Optional<CreditCard> optional = creditCardRepository.findById(id);

		if (optional.isPresent()) {
			logger.debug("The credit card id provided exists...", id);
		} else {
			logger.error("The credit card id provided does not exist...", id);
		}

		return optional.isPresent();
	}
}