package com.finance.service;

import java.util.Optional;

import javax.validation.Valid;
import javax.validation.ValidationException;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finance.domain.BankAccount;
import com.finance.exception.EntityNotFoundException;
import com.finance.repository.BankAccountRepository;

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
public class BankAccountController {

	/**
	 * Represents the bank account repository of data.
	 */
	@Autowired
	private BankAccountRepository bankAccountRepository;
	
	/**
	 * Retrieves all bank accounts.
	 * 
	 * @return a ResponseEntity<Iterable<BankAccount>> which contains all bank accounts. 
	 * The list can be empty if no bank account was found.
	 */	
	@GetMapping(produces = "application/json")
    public ResponseEntity<Iterable<BankAccount>> getAll() {
		Iterable<BankAccount> bankAccounts = bankAccountRepository.findAll();
		return new ResponseEntity<>(bankAccounts, HttpStatus.OK );
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
	@GetMapping(path = "/{id}", produces = "application/json")
    public ResponseEntity<BankAccount> getById(@PathVariable String id) throws EntityNotFoundException {
		
		Optional<BankAccount> optional = bankAccountRepository.findById(id);
		
		if( optional.isPresent() ) {
			BankAccount bankAccount = optional.get();
			return new ResponseEntity<BankAccount>( bankAccount, HttpStatus.OK );
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
	@PostMapping(produces = "application/json", consumes = "application/json")
	public ResponseEntity<BankAccount> insert(@Valid @RequestBody BankAccount bankAccount) {
		BankAccount savedBankAccount = bankAccountRepository.save(bankAccount);
		return new ResponseEntity<BankAccount>( savedBankAccount, HttpStatus.CREATED );
    }
	
	/**
	 * This method updates an existing bank account instance which is represented by its id.
	 * This id is specified by URL.
	 * 
	 * @param id the bank account instance id that will be updated.
	 * 
	 * @param bankAccount the bank account properties to be updated.
	 * 
	 * @return the new bank account after the updates.
	 * 
	 * @throws EntityNotFoundException if the id doesn't represent a valid bank account instance.
	 * 
	 * @throws MethodArgumentNotValidException if any required bank account data was not provided.
	 */
	@PutMapping(path = "/{id}", consumes="application/json", produces = "application/json")
    public ResponseEntity<BankAccount> update(@PathVariable String id, @RequestBody @Valid BankAccount bankAccount) throws EntityNotFoundException {
		
		/*
		 * Looking for the entity based on the id provided by URL.
		 */
		Optional<BankAccount> optional = bankAccountRepository.findById(id);

		if( optional.isPresent() ) {
			BankAccount storedBankAccount = optional.get();
			BeanUtils.copyProperties(bankAccount, storedBankAccount);
			
			/*
			 * Preserving the original object id...
			 */
			storedBankAccount.setId(id);
			
			/*
			 * Updating the object specified...
			 */
			storedBankAccount = bankAccountRepository.save(storedBankAccount);
			
			return new ResponseEntity<BankAccount>( storedBankAccount, HttpStatus.OK );
		}else {
			throw new EntityNotFoundException(id);
		}
    }	

	/**
	 * This method deletes a existing bank account represented by its id 
	 * which is provided through the URL.
	 * 
	 * @param id the id that represents the bank account instance that will be deleted.
	 * 
	 * @throws EntityNotFoundException if the id doesn't represent a valid bank account instance.
	 */	
	@DeleteMapping(path = "/{id}")
	public ResponseEntity<BankAccount> delete(@PathVariable String id) throws EntityNotFoundException {
		
		Optional<BankAccount> optional = bankAccountRepository.findById(id);
		
		if( optional.isPresent() ) {
			BankAccount bankAccount = optional.get();
			bankAccountRepository.delete(bankAccount);
			return new ResponseEntity<BankAccount>( HttpStatus.OK );
		}else {
			throw new EntityNotFoundException(id);
		}
    }
}