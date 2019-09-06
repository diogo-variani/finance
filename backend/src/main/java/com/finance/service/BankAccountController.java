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

import com.finance.domain.BankAccount;
import com.finance.domain.CreditCard;
import com.finance.exception.EntityNotFoundException;
import com.finance.repository.BankAccountRepository;

@RestController()
@RequestMapping(path = "/bankAccounts")
public class BankAccountController {

	@Autowired
	private BankAccountRepository bankAccountRepository;
	
	@GetMapping(produces = "application/json")
    public ResponseEntity<Iterable<BankAccount>> getAll() {
		Iterable<BankAccount> bankAccounts = bankAccountRepository.findAll();
		return new ResponseEntity<>(bankAccounts, HttpStatus.OK );
    }
	
	@GetMapping(path = "/{id}", produces = "application/json")
    public ResponseEntity<?> getById(@PathVariable String id) {
		
		Optional<BankAccount> optional = bankAccountRepository.findById(id);
		
		if( optional.isPresent() ) {
			BankAccount bankAccount = optional.get();
			return new ResponseEntity<BankAccount>( bankAccount, HttpStatus.OK );
		}else {
			throw new EntityNotFoundException(id);
		}
    }
	
	@PostMapping(produces = "application/json", consumes = "application/json")
	public ResponseEntity<?> save(@Valid @RequestBody BankAccount bankAccount) {
		BankAccount savedBankAccount = bankAccountRepository.save(bankAccount);
		return new ResponseEntity<BankAccount>( savedBankAccount, HttpStatus.CREATED );
    }

	@DeleteMapping(path = "/{id}")
	public ResponseEntity<?> delete(@PathVariable String id) {
		
		Optional<BankAccount> optional = bankAccountRepository.findById(id);
		
		if( optional.isPresent() ) {
			BankAccount bankAccount = optional.get();
			bankAccountRepository.delete(bankAccount);
			return new ResponseEntity<CreditCard>( HttpStatus.OK );
		}else {
			throw new EntityNotFoundException(id);
		}
    }
}