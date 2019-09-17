package com.finance.service;

import java.util.Optional;

import javax.validation.Valid;

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

import com.finance.domain.CreditCard;
import com.finance.exception.EntityNotFoundException;
import com.finance.repository.CreditCardRepository;

/**
 * <p>Controller that exposes all credit card features to be accessible through REST protocol.
 * This REST service follows the RESTful definition.</p>
 * 
 * <p>It is possible to create, update, get all, get by id and delete a credit card entity.
 * The base URL is: <code>/creditCards</code></p>
 * 
 * @author diogo.variani@gmail.com
 */
@CrossOrigin()
@RestController()
@RequestMapping(path = "/creditCards")
public class CreditCardController {

	/**
	 * Represents the credit card repository of data.
	 */
	@Autowired
	private CreditCardRepository creditCardRepository;
	
	/**
	 * Retrieves all credit cards.
	 * 
	 * @return a ResponseEntity<Iterable<CreditCard>> which contains all credit cards. 
	 * The list can be empty if no credit card was found.
	 */
	@GetMapping(produces = "application/json")
    public ResponseEntity<Iterable<CreditCard>> getAll() {
		Iterable<CreditCard> creditCards = creditCardRepository.findAll();
		return new ResponseEntity<Iterable<CreditCard>>(creditCards, HttpStatus.OK );
    }
	
	/**
	 * It looks for an specific credit card instance based on its ID which is 
	 * provided by URL.
	 * 
	 * @param id the credit card id that will be retrieved.
	 * 
	 * @return It returns a credit card instance represented by its id. If no credit card 
	 * was found, then an {@link EntityNotFoundException} is thrown.
	 * 
	 * @throws EntityNotFoundException if the id doesn't represent a credit card instance.
	 */
	@GetMapping(path = "/{id}", produces = "application/json")
    public ResponseEntity<CreditCard> getById(@PathVariable String id) throws EntityNotFoundException {
		
		Optional<CreditCard> optional = creditCardRepository.findById(id);
		
		if( optional.isPresent() ) {
			CreditCard creditCard = optional.get();
			return new ResponseEntity<CreditCard>( creditCard, HttpStatus.OK );
		}else {
			throw new EntityNotFoundException(id);
		}
    }

	/**
	 * This method updates an existing credit card instance which is represented by its id.
	 * This id is specified by URL.
	 * 
	 * @param id the credit card instance id that will be updated.
	 * 
	 * @param creditCard the credit card properties to be updated.
	 * 
	 * @return the new credit card after the updates.
	 * 
	 * @throws EntityNotFoundException if the id doesn't represent a valid credit card instance.
	 * 
	 * @throws MethodArgumentNotValidException if any required credit card data was not provided.
	 */
	@PutMapping(path = "/{id}", consumes="application/json", produces = "application/json")
    public ResponseEntity<CreditCard> update(@PathVariable String id, @RequestBody @Valid CreditCard creditCard) throws EntityNotFoundException {
		
		/*
		 * Looking for the entity based on the id provided by URL.
		 */
		Optional<CreditCard> optional = creditCardRepository.findById(id);

		if( optional.isPresent() ) {
			CreditCard storedCreditCard = optional.get();
			BeanUtils.copyProperties(creditCard, storedCreditCard);
			
			/*
			 * Preserving the original object id...
			 */
			storedCreditCard.setId(id);
			
			/*
			 * Updating the object specified...
			 */
			storedCreditCard = creditCardRepository.save(storedCreditCard);
			
			return new ResponseEntity<CreditCard>( storedCreditCard, HttpStatus.OK );
		}else {
			throw new EntityNotFoundException(id);
		}
    }

	
	/**
	 * It creates a new credit card instance based on the message provided.
	 * 
	 * @param creditCard the credit card that will be created.
	 * 
	 * @return the new credit card instance created and its id.
	 * 
	 * @throws MethodArgumentNotValidException if any required credit card data was not provided.
	 */
	@PostMapping(produces = "application/json", consumes = "application/json")
	public ResponseEntity<CreditCard> insert(@Valid @RequestBody CreditCard creditCard) {
		CreditCard savedCreditCard = creditCardRepository.save(creditCard);
		return new ResponseEntity<CreditCard>( savedCreditCard, HttpStatus.CREATED );
    }

	
	/**
	 * This method deletes a existing credit card represented by its id 
	 * which is provided through the URL.
	 * 
	 * @param id the id that represents the credit card instance that will be deleted.
	 * 
	 * @throws EntityNotFoundException if the id doesn't represent a valid credit card instance.
	 */
	@DeleteMapping(path = "/{id}")
	public ResponseEntity<?> delete(@PathVariable String id) throws EntityNotFoundException {
		
		Optional<CreditCard> optional = creditCardRepository.findById(id);
		
		if( optional.isPresent() ) {
			CreditCard creditCard = optional.get();
			creditCardRepository.delete(creditCard);
			return new ResponseEntity<>( HttpStatus.OK );
		}else {
			throw new EntityNotFoundException(id);
		}
    }
}