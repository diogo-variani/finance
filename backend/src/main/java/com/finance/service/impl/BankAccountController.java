package com.finance.service.impl;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finance.domain.BankAccount;
import com.finance.exception.EntityNotFoundException;
import com.finance.repository.BankAccountRepository;
import com.finance.service.IEntityService;

/**
 * <p>Controller that exposes all bank account features to be accessible through REST protocol.
 * This REST service follows the RESTful definition.</p>
 * 
 * <p>It is possible to create, update, get all, get by id and delete a bank account entity.
 * The base URL is: <code>/bankAccounts</code></p>
 * 
 * @author diogo.variani@gmail.com
 */

@CrossOrigin()
@RestController()
@RequestMapping(path = "/api/bankAccounts")
public class BankAccountController implements IEntityService<BankAccount>{

	/**
	 * Default logger instance.
	 */
	private final static Logger logger = LoggerFactory.getLogger(BankAccountController.class);
	
	/**
	 * Represents the bank account repository of data.
	 */
	@Autowired
	private BankAccountRepository bankAccountRepository;

	/**
	 * Retrieves all bank accounts.
	 * 
	 * @return 	an Iterable<BankAccount> which contains all bank accounts. 
	 * 			The list can be empty if no bank account was found.
	 */	
	@Override
	public Iterable<BankAccount> getAll() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		logger.debug("{}: Retrieving all bank accounts...", auth.getName());
		
		Iterable<BankAccount> bankAccounts = bankAccountRepository.findAll();
		return bankAccounts;	
	}

	/**
	 * It looks for an specific bank account instance based on its ID which is 
	 * provided by URL.
	 * 
	 * @param id the bank account id that will be retrieved.
	 * 
	 * @return It returns a bank account instance represented by its id. If no bank account 
	 * was found, then an {@link EntityNotFoundException} is thrown.
	 * 
	 * @throws EntityNotFoundException if the id doesn't represent a bank account instance.
	 */	
	@Override
	public BankAccount getById(String id) throws EntityNotFoundException {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		logger.debug("{}: Getting bank account by id {}...", auth.getName(), id);
		
		Optional<BankAccount> optional = bankAccountRepository.findById(id);
		
		if( optional.isPresent() ) {
			BankAccount bankAccount = optional.get();
			return bankAccount;
		}else {
			throw new EntityNotFoundException(id);
		}
	}

	/**
	 * This method updates an existing bank account instance which is represented by its id.
	 * This id is specified by URL.
	 * 
	 * @param id the bank account instance id that will be updated.
	 * @param bankAccount the bank account properties to be updated.
	 * 
	 * @return the new bank account after the updates.
	 * 
	 * @throws EntityNotFoundException if the id doesn't represent a valid bank account instance.
	 * @throws MethodArgumentNotValidException if any required bank account data was not provided.
	 */
	@Override
	public BankAccount update(String id, BankAccount entity) throws EntityNotFoundException {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		logger.debug("{}: Updating bank account id {}, values {}...", auth.getName(), id, entity);
		
		/*
		 * Looking for the entity based on the id provided by URL.
		 */
		Optional<BankAccount> optional = bankAccountRepository.findById(id);

		if( optional.isPresent() ) {
			entity.setId(id);
			bankAccountRepository.save(entity);
			return entity;
		}else {
			throw new EntityNotFoundException(id);
		}
	}

	/**
	 * It creates a new bank account instance based on the message provided.
	 * 
	 * @param creditCard the bank account that will be created.
	 * 
	 * @return the new bank account instance created and its id.
	 * 
	 * @throws MethodArgumentNotValidException if any required bank account data was not provided.
	 */		
	@Override
	public BankAccount insert(BankAccount entity) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		logger.debug("{}: Inserting a new bank account {}...", auth.getName(), entity);
		
		bankAccountRepository.save(entity);
		return entity;
	}

	/**
	 * This method deletes a existing bank account represented by its id 
	 * which is provided through the URL.
	 * 
	 * @param id the id that represents the bank account instance that will be deleted.
	 * 
	 * @throws EntityNotFoundException if the id doesn't represent a valid bank account instance.
	 */	
	@Override
	public void delete(String id) throws EntityNotFoundException {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		logger.debug("{}: Deleting a bank account id {}...", auth.getName(), id);		
		
		Optional<BankAccount> optional = bankAccountRepository.findById(id);
		
		if( optional.isPresent() ) {
			BankAccount bankAccount = optional.get();
			bankAccountRepository.delete(bankAccount);
		}else {
			throw new EntityNotFoundException(id);
		}
	}
}