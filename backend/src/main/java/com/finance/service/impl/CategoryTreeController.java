package com.finance.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finance.domain.Category;
import com.finance.exception.EntityNotFoundException;
import com.finance.repository.CategoryRepository;
import com.finance.service.ICategoryTreeService;

@CrossOrigin()
@RestController()
@RequestMapping(path = "/api/categories/tree")
public class CategoryTreeController implements ICategoryTreeService{

	/**
	 * Default logger instance.
	 */
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
	@Override
	public Iterable<Category> getAll() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		logger.debug("{}: Retrieving all category tree...", auth.getName());
		
		List<Category> roots = categoryRepository.findByParentId(null);
		roots.parallelStream().forEach( this::deepLoad );
		
		return roots;
	}

	/**
	 * It looks for an specific category tree instance based on its ID which is 
	 * provided by URL.
	 * 
	 * @param id the category tree id that will be retrieved.
	 * 
	 * @return It returns a category tree instance represented by its id. If no category 
	 * tree was found, then an {@link EntityNotFoundException} is thrown.
	 * 
	 * @throws EntityNotFoundException if the id doesn't represent a category tree instance.
	 */		
	@Override
	public Category getById(String id) throws EntityNotFoundException {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		logger.debug("{}: Getting category tree by id {}...", auth.getName(), id);
		
		Optional<Category> optional = categoryRepository.findById(id);
		
		if( !optional.isPresent() ) {
			throw new EntityNotFoundException(id);
		}

		Category category = optional.get();
		deepLoad( category );
		
		return category;
	}

	/**
	 * This method updates an existing category tree instance which is represented by its id.
	 * This id is specified by URL.
	 * 
	 * @param id the category tree instance id that will be updated.
	 * 
	 * @param category the category tree properties to be updated.
	 * 
	 * @return the new category tree after the updates.
	 * 
	 * @throws EntityNotFoundException if the id doesn't represent a valid category tree instance.
	 * 
	 * @throws MethodArgumentNotValidException if any required category tree data was not provided.
	 */	
	@Override
	public Category update(String id, Category entity) throws EntityNotFoundException {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		logger.debug("{}: Updating category tree id {}, values {}...", auth.getName(), id, entity);
		
		entity.setId(id);
		deepUpdate( entity );
		return entity;
	}

	/**
	 * It creates a new category tree instance based on the message provided.
	 * 
	 * @param category the category tree that will be created.
	 * 
	 * @return the new category tree instance created and its id.
	 * 
	 * @throws MethodArgumentNotValidException if any required category tree data was not provided.
	 */	
	@Override
	public Category insert(Category entity) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		logger.debug("{}: Inserting a new category tree {}...", auth.getName(), entity);
		
		deepInsert( entity );
		return entity;
	}

	/**
	 * This method deletes an existing category tree represented by its id 
	 * which is provided through the URL.
	 * 
	 * @param id the id that represents the category tree instance that will be deleted.
	 * 
	 * @throws EntityNotFoundException if the id doesn't represent a valid category tree instance.
	 */	
	@Override
	public void delete(String id) throws EntityNotFoundException {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		logger.debug("{}: Deleting the category tree id {}...", auth.getName(), id);
		
		Optional<Category> optional = categoryRepository.findById(id);
		
		if( !optional.isPresent() ) {
			throw new EntityNotFoundException(id);
		}

		Category category = optional.get();
		deepDelete( category );
	}

	/**
	 * Retrieves only the root categories.
	 * 
	 * @return the root categories.
	 */	
	@Override
	public Iterable<Category> getRoots() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		logger.debug("{}: Getting category tree roots...", auth.getName());
		
		List<Category> roots = categoryRepository.findByParentId(null);
		return roots;
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
	
	private void deepDelete(Category category) {
		deepLoad(category);
		List<Category> toDelete = toFlatList(category, true);
		categoryRepository.deleteAll(toDelete);
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