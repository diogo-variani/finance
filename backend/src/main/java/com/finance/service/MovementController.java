package com.finance.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.finance.domain.Movement;
import com.finance.exception.EntityNotFoundException;
import com.finance.repository.MovementRepository;
import com.finance.util.MovementFilterBuilder;
import com.finance.util.PageResponseBuilder;
import com.querydsl.core.types.Predicate;

@CrossOrigin()
@RestController()
@RequestMapping(path = "/api/movements")
public class MovementController extends PageableController {

	private final static Logger logger = LoggerFactory.getLogger(MovementController.class);
	
	/**
	 * Represents the movement repository of data.
	 */
	@Autowired
	private MovementRepository movementRepository;
	
	public MovementController() {
	}
	
	@GetMapping(produces = "application/json")
    public ResponseEntity<Map<String, Object>> filter( 	@RequestParam(name = "page", required = false, defaultValue = "0") Integer page, 
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
    													@DateTimeFormat(pattern = "yyyy-MM-dd") @RequestParam(name = "purchaseFinalDate", required = false) Date purchaseFinalDate) {

		validateSortFields(sortBy, sortDir, Movement.class);
		
		/* Creating the page request based on the parameters provided */
		PageRequest pageRequest = cretePageRequest( page, size, sortBy, sortDir );
		
		Predicate predicate = MovementFilterBuilder.start()
									.store(store)
									.values(initialValue, finalValue)
									.categoryIds(categoryIds)
									.bankAccountIds(bankAccountIds)
									.paymentDate(paymentInitialDate, paymentFinalDate)
									.purchaseDate(purchaseInitialDate, purchaseFinalDate)
									.build();
		
		Page<Movement> movementPage = null;
		if( predicate == null ) {
			movementPage = movementRepository.findAll(pageRequest);
		}else {
			movementPage = movementRepository.findAll(predicate, pageRequest);
		}
		
		/* Creating the response with page information, data and links. */
		PageResponseBuilder builder = PageResponseBuilder.from(movementPage);
		
		Map<String, Object> response = builder.build();
		
		return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK );
    }
		
	@GetMapping(path = "/{id}", produces = "application/json")
    public ResponseEntity<Movement> getById(@PathVariable String id) throws EntityNotFoundException {
		Optional<Movement> optional = movementRepository.findById(id);
		
		if( optional.isPresent() ) {
			Movement movement = optional.get();
			return new ResponseEntity<Movement>( movement, HttpStatus.OK );
		}else {
			throw new EntityNotFoundException(id);
		}
    }
	
	@PreAuthorize("hasAnyRole('admin', 'user')")
	@PostMapping(produces = "application/json", consumes = "application/json")
	public ResponseEntity<Movement> insert(@Valid @RequestBody Movement movement) {
		movementRepository.save(movement);
		return new ResponseEntity<Movement>( movement, HttpStatus.CREATED );
    }
	
	@PreAuthorize("hasAnyRole('admin', 'user')")
	@PutMapping(path = "/{id}", consumes="application/json", produces = "application/json")
    public ResponseEntity<Movement> update(@PathVariable String id, @RequestBody @Valid Movement movement) throws EntityNotFoundException {
		
		/*
		 * Looking for the entity based on the id provided by URL.
		 */
		Optional<Movement> optional = movementRepository.findById(id);

		if( optional.isPresent() ) {
			movement.setId(id);
			movementRepository.save(movement);
			return new ResponseEntity<Movement>( movement, HttpStatus.OK );
		}else {
			throw new EntityNotFoundException(id);
		}
    }
	
	@PreAuthorize("hasAnyRole('admin', 'user')")
	@DeleteMapping(path = "/{id}")
	public ResponseEntity<Movement> delete(@PathVariable String id) throws EntityNotFoundException {
		Optional<Movement> optional = movementRepository.findById(id);
		
		if( optional.isPresent() ) {
			Movement movement = optional.get();
						
			/*
			 * Then we delete the category from the database.
			 */
			movementRepository.delete(movement);
			return new ResponseEntity<Movement>( HttpStatus.OK );
		}else {
			throw new EntityNotFoundException(id);
		}
    }
	
	@DeleteMapping(produces = "application/json")
	public ResponseEntity<Movement> delete(@RequestParam(name = "ids") List<String> ids ) throws EntityNotFoundException {
		Iterable<Movement> itrMovements = movementRepository.findAllById(ids);
		
		List<Movement> movements = new ArrayList<Movement>();
		itrMovements.forEach(movements::add);
		
		movementRepository.deleteAll(movements);
		
		return new ResponseEntity<Movement>( HttpStatus.OK );
    }	
}