package com.finance.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finance.domain.Category;
import com.finance.exception.EntityNotFoundException;
import com.finance.repository.CategoryRepository;

@CrossOrigin()
@RestController()
@RequestMapping(path = "/categories")
public class CategoryController {

	@Autowired
	private CategoryRepository categoryRepository;
	
	@GetMapping(produces = "application/json")
    public ResponseEntity<List<Category>> getAll() {
		Iterable<Category> iterable = categoryRepository.findAll();
		List<Category> categories = new ArrayList<Category>();
		
		iterable.forEach( categories::add );
		
		return new ResponseEntity<>(categories, HttpStatus.OK );
    }
	
	@GetMapping(path = "/{id}", produces = "application/json")
    public ResponseEntity<?> getById(@PathVariable String id) throws EntityNotFoundException {
		Optional<Category> optional = categoryRepository.findById(id);
		
		if( optional.isPresent() ) {
			Category category = optional.get();
			return new ResponseEntity<Category>( category, HttpStatus.OK );
		}else {
			throw new EntityNotFoundException(id);
		}
    }
	
	@PostMapping(produces = "application/json", consumes = "application/json")
	public ResponseEntity<Category> insert(@Valid @RequestBody Category category) {
		categoryRepository.save(category);
		category.setSubCategories(null);
		return new ResponseEntity<Category>( category, HttpStatus.CREATED );
    }
	
	@PutMapping(path = "/{id}", consumes="application/json", produces = "application/json")
    public ResponseEntity<Category> update(@PathVariable String id, @RequestBody @Valid Category category) throws EntityNotFoundException {
		
		/*
		 * Looking for the entity based on the id provided by URL.
		 */
		Optional<Category> optional = categoryRepository.findById(id);

		if( optional.isPresent() ) {
			category.setId(id);
			category = categoryRepository.save(category);
			return new ResponseEntity<Category>( category, HttpStatus.OK );
		}else {
			throw new EntityNotFoundException(id);
		}
    }
	
	@DeleteMapping(path = "/{id}")
	public ResponseEntity<?> delete(@PathVariable String id) throws EntityNotFoundException {
		Optional<Category> optional = categoryRepository.findById(id);
		
		if( optional.isPresent() ) {
			Category category = optional.get();
			
			/*
			 * Since it is a valid category, then firstly we remove the parent references.
			 */
			List<Category> subCategories = categoryRepository.findByParentId( category.getId() );
			if( subCategories != null ) {
				subCategories.forEach(c -> c.setParentId(null));
				categoryRepository.saveAll(subCategories);
			}
			
			/*
			 * Then we delete the category from the database.
			 */
			categoryRepository.delete(category);
			return new ResponseEntity<Category>( HttpStatus.OK );
		}else {
			throw new EntityNotFoundException(id);
		}
    }
}