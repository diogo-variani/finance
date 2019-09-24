package com.finance.service;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import java.util.Map;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.Link;
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
import com.finance.util.PageResponseBuilder;

@CrossOrigin()
@RestController()
@RequestMapping(path = "/movements")
public class MovementController extends PageableController {

	private final static Logger logger = LoggerFactory.getLogger(MovementController.class);
	
	/**
	 * Represents the movement repository of data.
	 */
	@Autowired
	private MovementRepository movementRepository;
	
	public MovementController() {
	}
	
	//@GetMapping(produces = "application/json", params = { "page", "size", "sortBy", "sortDir" })
	@GetMapping(produces = "application/json")
    public ResponseEntity<Map<String, Object>> getAll( 	@RequestParam(name = "page", required = false) Integer page, 
    													@RequestParam(name = "size", required = false) Integer size, 
    													@RequestParam(name = "sortBy", required = false) String sortBy, 
    													@RequestParam(name = "sortDir", required = false) String sortDir ) {

		validateSortFields(sortBy, sortDir, Movement.class);
		
		/* Creating the page request based on the parameters provided */
		PageRequest pageRequest = cretePageRequest( page, size, sortBy, sortDir );
		
		logger.info("Getting all movements. Page: {}, Size {}", pageRequest.getPageNumber(), pageRequest.getPageSize() );
		
		/* Find all movements paginated */
		Page<Movement> movementPage = movementRepository.findAll(pageRequest);
		
		
		/* Creating the response with page information, data and links. */
		PageResponseBuilder builder = PageResponseBuilder.from(movementPage);
		
		if( movementPage.hasNext() ) {
			Link next = createLink( movementPage.nextPageable(), Link.REL_NEXT, sortBy, sortDir );
			builder.link( next );
		}
		
		if(movementPage.hasPrevious()) {
			Link previous = createLink( movementPage.previousPageable(), Link.REL_PREVIOUS, sortBy, sortDir );
			builder.link( previous );
		}
		
		Map<String, Object> response = builder.build();
		
		return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK );
    }
	
	private Link createLink(Pageable pageable, String rel, String sortBy, String sortDir) {
		int pageNumber = pageable.getPageNumber();
		int pageSize = pageable.getPageSize();
		
		return linkTo(methodOn(MovementController.class).getAll(pageNumber, pageSize, sortBy, sortDir)).withRel( rel );
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