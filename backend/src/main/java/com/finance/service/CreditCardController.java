package com.finance.service;

import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finance.domain.CreditCard;
import com.finance.exception.EntityNotFoundException;
import com.finance.repository.CreditCardRepository;

@RestController()
@RequestMapping(path = "/creditCards")
public class CreditCardController {

	@Autowired
	private CreditCardRepository creditCardRepository;
	
	@GetMapping(produces = "application/json")
    public ResponseEntity<Iterable<CreditCard>> getAll() {
		Iterable<CreditCard> creditCards = creditCardRepository.findAll();
		return new ResponseEntity<>(creditCards, HttpStatus.OK );
    }
	
	@GetMapping(path = "/{id}", produces = "application/json")
    public ResponseEntity<?> getById(@PathVariable String id) {
		
		Optional<CreditCard> optional = creditCardRepository.findById(id);
		
		if( optional.isPresent() ) {
			CreditCard creditCard = optional.get();
			return new ResponseEntity<CreditCard>( creditCard, HttpStatus.OK );
		}else {
			throw new EntityNotFoundException(id);
		}
    }
	
	@PostMapping(produces = "application/json", consumes = "application/json")
	public ResponseEntity<?> save(@Valid @RequestBody CreditCard creditCard) {
		CreditCard savedCreditCard = creditCardRepository.save(creditCard);
		return new ResponseEntity<CreditCard>( savedCreditCard, HttpStatus.CREATED );
    }

	@DeleteMapping(path = "/{id}")
	public ResponseEntity<?> delete(@PathVariable String id) {
		
		Optional<CreditCard> optional = creditCardRepository.findById(id);
		
		if( optional.isPresent() ) {
			CreditCard creditCard = optional.get();
			creditCardRepository.delete(creditCard);
			return new ResponseEntity<CreditCard>( HttpStatus.OK );
		}else {
			throw new EntityNotFoundException(id);
		}
    }
}