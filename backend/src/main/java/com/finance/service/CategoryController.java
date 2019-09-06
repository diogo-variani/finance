package com.finance.service;

import java.util.ArrayList;
import java.util.List;
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

import com.finance.domain.Category;
import com.finance.exception.EntityNotFoundException;
import com.finance.repository.CategoryRepository;

@RestController()
@RequestMapping(path = "/categories")
public class CategoryController {

	@Autowired
	private CategoryRepository categoryRepository;
	
	@GetMapping(produces = "application/json")
    public ResponseEntity<Iterable<Category>> getAll() {
		Iterable<Category> categories = categoryRepository.findAll();
		return new ResponseEntity<>(categories, HttpStatus.OK );
    }
	
	@GetMapping(path = "/{id}", produces = "application/json")
    public ResponseEntity<?> getById(@PathVariable String id) {
		
		Optional<Category> optional = categoryRepository.findById(id);
		
		if( optional.isPresent() ) {
			Category category = optional.get();
			return new ResponseEntity<Category>( category, HttpStatus.OK );
		}else {
			throw new EntityNotFoundException(id);
		}
    }
	
	@GetMapping(path = "/{id}/details", produces = "application/json")
    public ResponseEntity<?> getDetails(@PathVariable String id) {
		
		Optional<Category> optional = categoryRepository.findById(id);
		
		if( optional.isPresent() ) {
			Category category = optional.get();
			
			List<Category> subCategories = getSubCategories(category);
			category.setSubCategories(subCategories);
			
			return new ResponseEntity<Category>( category, HttpStatus.OK );
		}else {
			throw new EntityNotFoundException(id);
		}
    }
	
	@PostMapping(produces = "application/json", consumes = "application/json")
	public ResponseEntity<Category> save(@Valid @RequestBody Category category) {
		Category savedCategory = categoryRepository.save(category);
		
		/*
		 * Handling the sub categories
		 */
		if( category.hasSubCategories() ) {
			List<Category> subCategories = category.getSubCategories();			
			/*
			 * Setting the parent id for each sub category...
			 */
			String parentId = savedCategory.getId();
			subCategories.stream().forEach(subCategory -> subCategory.setParentId(parentId));
			
			
			/*
			 * Saving all sub categories into the database
			 */
			Iterable<Category> iterableCategories = categoryRepository.saveAll(subCategories);
			
			/*
			 * Converting the sub categories iterable which was saved into the database
			 * to a List.
			 */
			List<Category> savedSubCategories = new ArrayList<Category>();
			iterableCategories.forEach( savedSubCategories::add );
			savedCategory.setSubCategories(savedSubCategories);
		}
		
		return new ResponseEntity<Category>( savedCategory, HttpStatus.CREATED );
    }

	@DeleteMapping(path = "/{id}")
	public ResponseEntity<?> delete(@PathVariable String id) {
		
		Optional<Category> optional = categoryRepository.findById(id);
		
		if( optional.isPresent() ) {
			Category category = optional.get();
			categoryRepository.delete(category);
			return new ResponseEntity<Category>( HttpStatus.OK );
		}else {
			throw new EntityNotFoundException(id);
		}
    }
	
	private List<Category> getSubCategories(Category category){
		String parentId = category.getId();
		List<Category> subCategories = categoryRepository.findByParentId(parentId);
		return subCategories;
	}
}