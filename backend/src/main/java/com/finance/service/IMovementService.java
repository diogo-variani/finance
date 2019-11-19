package com.finance.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.finance.domain.Movement;
import com.finance.exception.EntityNotFoundException;

/**
 * <p>It defines the basic REST service contract of the movements.</p>
 * 
 * <p>It exposes the main resources to allow the category tree's management.</p>
 * 
 * @author diogo.variani@gmail.com
 */
public interface IMovementService {
	
	@GetMapping(produces = "application/json")
	public Map<String, Object> filter( 	@RequestParam(name = "page", required = false, defaultValue = "0") Integer page, 
			@RequestParam(name = "size", required = false, defaultValue = "10") Integer size, 
			@RequestParam(name = "sortBy", required = false) String sortBy, 
			@RequestParam(name = "sortDir", required = false) String sortDir,
			@RequestParam(name = "store", required = false) String store,
			@RequestParam(name = "initialValue", required = false) BigDecimal initialValue,
			@RequestParam(name = "finalValue", required = false) BigDecimal finalValue,
			@RequestParam(name = "categoryIds", required = false) String[] categoryIds,
			@RequestParam(name = "bankAccountsIds", required = false) String[] bankAccountIds,
			@RequestParam(name = "creditCardIds", required = false) String[] creditCardIds,
			@DateTimeFormat(pattern = "yyyy-MM-dd") @RequestParam(name = "paymentInitialDate", required = false) Date paymentInitialDate,
			@DateTimeFormat(pattern = "yyyy-MM-dd") @RequestParam(name = "paymentFinalDate", required = false) Date paymentFinalDate,
			@DateTimeFormat(pattern = "yyyy-MM-dd") @RequestParam(name = "purchaseInitialDate", required = false) Date purchaseInitialDate,
			@DateTimeFormat(pattern = "yyyy-MM-dd") @RequestParam(name = "purchaseFinalDate", required = false) Date purchaseFinalDate);
	
	@GetMapping(path = "/{id}", produces = "application/json")
    public Movement getById(@PathVariable String id) throws EntityNotFoundException;
	
	@PreAuthorize("hasAnyRole('admin', 'user')")
	@PostMapping(produces = "application/json", consumes = "application/json")
	@ResponseStatus(value = HttpStatus.CREATED)
	public Movement insert(@Valid @RequestBody Movement movement);
	
	@PreAuthorize("hasAnyRole('admin', 'user')")
	@PutMapping(path = "/{id}", consumes="application/json", produces = "application/json")
    public Movement update(@PathVariable String id, @RequestBody @Valid Movement movement) throws EntityNotFoundException; 	
	
	@PreAuthorize("hasAnyRole('admin', 'user')")
	@DeleteMapping(path = "/{id}")
	public void delete(@PathVariable String id) throws EntityNotFoundException;	
	
	@PreAuthorize("hasAnyRole('admin', 'user')")
	@DeleteMapping(produces = "application/json")
	@ResponseStatus(value = HttpStatus.OK)
	public void delete(@RequestParam(name = "ids") List<String> ids ) throws EntityNotFoundException;
}