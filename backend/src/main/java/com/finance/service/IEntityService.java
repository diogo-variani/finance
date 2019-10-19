package com.finance.service;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.finance.domain.BaseEntity;
import com.finance.exception.EntityNotFoundException;

/**
 * <p>It defines the basic REST service contract of an entity.</p>
 * 
 * <p>It exposes the main resources to allow the entity's management.</p>
 * 
 * @author diogo.variani@gmail.com
 */
public interface IEntityService<T extends BaseEntity> {

	/**
	 * Retrieves all entities.
	 * 
	 * @return a Iterable<CreditCard> which contains all entities. 
	 * 			The list can be empty if no credit card was found.
	 */
	@GetMapping(produces = "application/json")
	public Iterable<T> getAll();
	
	/**
	 * It looks for an specific entity instance based on its ID which is 
	 * provided by URL.
	 * 
	 * @param id the entity id that will be retrieved.
	 * 
	 * @return It returns an entity instance represented by its id. If no entity 
	 * was found, then an {@link EntityNotFoundException} is thrown.
	 * 
	 * @throws EntityNotFoundException if the id doesn't represent a entity instance.
	 */
	@GetMapping(path = "/{id}", produces = "application/json")
    public T getById(@PathVariable String id) throws EntityNotFoundException;
	
	/**
	 * This method updates an existing entity instance which is represented by its id.
	 * This id is specified by URL.
	 * 
	 * @param id 		the entity instance id that will be updated.
	 * @param entity 	the entity properties to be updated.
	 * 
	 * @return 			the new entity after the updates.
	 * 
	 * @throws EntityNotFoundException 			if the id doesn't represent a valid entity instance.
	 * @throws MethodArgumentNotValidException 	if any required entity data was not provided.
	 */	
	@PreAuthorize("hasAnyRole('admin', 'user')")
	@PutMapping(path = "/{id}", consumes="application/json", produces = "application/json")
    public T update(@PathVariable String id, @RequestBody @Valid T entity) throws EntityNotFoundException;
	
	/**
	 * It creates a new entity instance based on the message provided.
	 * 
	 * @param entity 	the entity that will be created.
	 * 
	 * @return 			the new entity instance created and its id.
	 * 
	 * @throws MethodArgumentNotValidException if any required entity data was not provided.
	 */	
	@PreAuthorize("hasAnyRole('admin', 'user')")
	@PostMapping(produces = "application/json", consumes = "application/json")
	@ResponseStatus(value = HttpStatus.CREATED)
	public T insert(@Valid @RequestBody T entity);
	
	/**
	 * This method deletes a existing entity represented by its id 
	 * which is provided through the URL.
	 * 
	 * @param id 		the id that represents the entity instance that will be deleted.
	 * 
	 * @throws EntityNotFoundException 		if the id doesn't represent a valid entity instance.
	 */	
	@PreAuthorize("hasAnyRole('admin')")
	@DeleteMapping(path = "/{id}")
	@ResponseStatus(value = HttpStatus.OK)
	public void delete(@PathVariable String id) throws EntityNotFoundException;	
}
