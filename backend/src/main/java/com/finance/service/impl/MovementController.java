package com.finance.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finance.domain.Movement;
import com.finance.exception.EntityNotFoundException;
import com.finance.repository.MovementRepository;
import com.finance.service.IMovementService;
import com.finance.service.PageableController;
import com.finance.util.MovementFilterBuilder;
import com.finance.util.PageResponseBuilder;
import com.querydsl.core.types.Predicate;

@CrossOrigin()
@RestController()
@RequestMapping(path = "/api/movements")
public class MovementController extends PageableController implements IMovementService {
	
	/**
	 * Default logger instance.
	 */
	private final static Logger logger = LoggerFactory.getLogger(MovementController.class);
	
	/**
	 * Represents the movement repository of data.
	 */
	@Autowired
	private MovementRepository movementRepository;

	@Override
	public Map<String, Object> filter(Integer page, Integer size, String sortBy, String sortDir, String store,
			BigDecimal initialValue, BigDecimal finalValue, String[] categoryIds, String[] bankAccountIds,
			String[] creditCardIds, Date paymentInitialDate, Date paymentFinalDate, Date purchaseInitialDate,
			Date purchaseFinalDate) {
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
		
		return builder.build();
	}

	@Override
	public Movement getById(String id) throws EntityNotFoundException {
		Optional<Movement> optional = movementRepository.findById(id);
		
		if( optional.isPresent() ) {
			Movement movement = optional.get();
			return movement;
		}else {
			throw new EntityNotFoundException(id);
		}

	}

	@Override
	public Movement insert(Movement movement) {
		movementRepository.save(movement);
		return movement;
	}

	@Override
	public Movement update(String id, Movement movement) throws EntityNotFoundException {
		
		/*
		 * Looking for the entity based on the id provided by URL.
		 */
		Optional<Movement> optional = movementRepository.findById(id);

		if( optional.isPresent() ) {
			movement.setId(id);
			movementRepository.save(movement);
			return movement;
		}else {
			throw new EntityNotFoundException(id);
		}
	}

	@Override
	public void delete(String id) throws EntityNotFoundException {
		Optional<Movement> optional = movementRepository.findById(id);
		
		if( optional.isPresent() ) {
			Movement movement = optional.get();
						
			/*
			 * Then we delete the category from the database.
			 */
			movementRepository.delete(movement);
		}else {
			throw new EntityNotFoundException(id);
		}
	}

	@Override
	public void delete(List<String> ids) throws EntityNotFoundException {
		Iterable<Movement> itrMovements = movementRepository.findAllById(ids);
		
		List<Movement> movements = new ArrayList<Movement>();
		itrMovements.forEach(movements::add);
		
		movementRepository.deleteAll(movements);
	}
}