package com.finance.validator;

import java.util.Optional;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.finance.constraint.BankAccountExist;
import com.finance.domain.BankAccount;
import com.finance.repository.BankAccountRepository;

public class BankAccountExistValidator implements ConstraintValidator<BankAccountExist, String> {

	private final static Logger logger = LoggerFactory.getLogger(BankAccountExistValidator.class);

	@Autowired
	private BankAccountRepository bankAccountRepository;

	@Override
	public boolean isValid(String id, ConstraintValidatorContext context) {

		logger.debug("Veryfing if the bank account {} exists...", id);

		if (id == null) {
			logger.warn("The bank account id provided is null...");
			return true;
		}

		Optional<BankAccount> optional = bankAccountRepository.findById(id);

		if (optional.isPresent()) {
			logger.debug("The bank account id provided exists...", id);
		} else {
			logger.error("The bank account id provided does not exist...", id);
		}

		return optional.isPresent();
	}
}