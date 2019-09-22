package com.finance.service;

import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.finance.domain.Movement;
import com.finance.exception.EntityNotFoundException;
import com.finance.repository.MovementRepository;


@CrossOrigin()
@RestController()
@RequestMapping(path = "/movements")
public class MovementController extends PageableController {

	
	/**
	 * Represents the movement repository of data.
	 */
	@Autowired
	private MovementRepository movementRepository;
	
	@GetMapping(produces = "application/json", params = { "page", "size" })
    public ResponseEntity<Iterable<Movement>> getAll( @RequestParam("page") int page, @RequestParam("size") int size ) {
		PageRequest pageRequest = cretePageRequest( page, size );
		
		Page<Movement> movements = movementRepository.findAll(pageRequest);
		return new ResponseEntity<>(movements.getContent(), HttpStatus.OK );
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
	
	@PostMapping(produces = "application/json", consumes = "application/json")
	public ResponseEntity<Movement> insert(@Valid @RequestBody Movement movement) {
		movementRepository.save(movement);
		return new ResponseEntity<Movement>( movement, HttpStatus.CREATED );
    }
}