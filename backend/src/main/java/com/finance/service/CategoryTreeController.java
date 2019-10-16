package com.finance.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RestController;

import com.finance.domain.Category;
import com.finance.exception.EntityNotFoundException;
import com.finance.repository.CategoryRepository;

@CrossOrigin()
@RestController()
@RequestMapping(path = "/api/categories/tree")
public class CategoryTreeController {

	private final static Logger logger = LoggerFactory.getLogger(CategoryTreeController.class);
	
	/**
	 * Reference to the category repository component.
	 */
	@Autowired
	private CategoryRepository categoryRepository;
	
	/**
	 * Retrieves all categories in a tree message based on the categories configuration.
	 * 
	 * @return the whole tree of categories.
	 */
	@GetMapping(produces = "application/json")
    public ResponseEntity<List<Category>> getAll() {

		logger.info("Loading the whole category tree...");
		
		List<Category> roots = categoryRepository.findByParentId(null);
		roots.parallelStream().forEach( this::deepLoad );
		
		return new ResponseEntity<List<Category>>(roots, HttpStatus.OK );
    }
	
	@GetMapping(path = "/{id}", produces = "application/json")
    public ResponseEntity<Category> getById(@PathVariable String id) throws EntityNotFoundException {
		logger.info("Loading tree by id {}...", id);
		
		Optional<Category> optional = categoryRepository.findById(id);
		
		if( !optional.isPresent() ) {
			throw new EntityNotFoundException(id);
		}

		Category category = optional.get();
		deepLoad( category );
		
		return new ResponseEntity<Category>( category, HttpStatus.OK );
    }
	
	@GetMapping(path = "/roots", produces = "application/json")
    public ResponseEntity<List<Category>> getRoots() throws EntityNotFoundException {
		logger.info("Loading roots...");		
		
		List<Category> roots = categoryRepository.findByParentId(null);
		return new ResponseEntity<List<Category>>( roots, HttpStatus.OK );
    }
	
	@PreAuthorize("hasAnyRole('admin', 'user')")
	@PostMapping(consumes = "application/json", produces = "application/json")
	public ResponseEntity<Category> insert( @RequestBody @Valid Category category ){
		logger.info("Inserting new category tree {}", category.toString());
		
		deepInsert( category );
		return new ResponseEntity<Category>( category, HttpStatus.OK );
	}
	
	@PreAuthorize("hasAnyRole('admin', 'user')")
	@PutMapping(path = "/{id}", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Category> update( @PathVariable String id, @RequestBody @Valid Category category ){
		logger.info("Updating category tree {}: {}", id, category.toString());
		
		category.setId(id);
		deepUpdate( category );
		return new ResponseEntity<Category>( category, HttpStatus.OK );
	}
	
	@PreAuthorize("hasAnyRole('admin')")
	@DeleteMapping(path = "/{id}", produces = "application/json")
	public ResponseEntity<?> delete( @PathVariable String id ) throws EntityNotFoundException{
		logger.info("Deleting category tree {}", id);
		
		Optional<Category> optional = categoryRepository.findById(id);
		
		if( !optional.isPresent() ) {
			throw new EntityNotFoundException(id);
		}

		Category category = optional.get();
		deepDelete( category );
		
		return new ResponseEntity<>( HttpStatus.OK );
	}	
	
	private void deepDelete(Category category) {
		deepLoad(category);
		List<Category> toDelete = toFlatList(category, true);
		categoryRepository.deleteAll(toDelete);
	}
	
	private void deepUpdate(Category category) {
		categoryRepository.save( category );

		//Delete all sub categories to be inserted afterwards
		categoryRepository.deleteByParentId(new ObjectId(category.getId()));
		
		List<Category> subCategories = category.getSubCategories();
		
		if( subCategories == null ) {
			return;
		}
		
		//Update every single sub category...
		subCategories.parallelStream().forEach( subCategory -> {
			subCategory.setParentId(category.getId());
			deepUpdate(subCategory);
		});
	}
	
	private void deepInsert( Category category ) {
		List<Category> subCategories = category.getSubCategories();
		
		Category newCategory = categoryRepository.save(category);
		BeanUtils.copyProperties(newCategory, category);
		
		if( subCategories == null ) {
			return;
		}
		
		String parentId = category.getId();
		subCategories.parallelStream().forEach( subCategory -> {
			subCategory.setParentId(parentId);
			deepInsert(subCategory); 
		});
		
		category.setSubCategories(subCategories);
	}
	
	private void deepLoad( Category category ) {
		String title = category.getTitle();
		String id = category.getId();
		
		logger.debug("Deep loading of category {} ({})", title, id);
		
		List<Category> subCategories = categoryRepository.findByParentId(new ObjectId(id));
		
		if( subCategories.isEmpty() ) {
			return;
		}
		
		category.setSubCategories(subCategories);
		
		subCategories.parallelStream().forEach( this::deepLoad );
	}

	private List<Category> toFlatList(Category category, boolean includeParent ){
		List<Category> categories = new ArrayList<Category>();

		if( includeParent ) {
			categories.add( category );
		}
		
		List<Category> subCategories = new ArrayList<Category>();
		
		if( subCategories == null || subCategories.isEmpty() ) {
			return categories;
		}
		
		categories.addAll( subCategories );
		subCategories.forEach( sc -> categories.addAll( toFlatList(sc, false ) ));
		
		return categories;
	}
}