package com.finance.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import com.finance.service.IEntityService;

@CrossOrigin()
@RestController()
@RequestMapping(path = "/api/categories")
public class CategoryController implements IEntityService<Category>{

	/**
	 * Default logger instance.
	 */
	private final static Logger logger = LoggerFactory.getLogger(CategoryController.class);
	
	/**
	 * Represents the category repository of data.
	 */	
	@Autowired
	private CategoryRepository categoryRepository;

	/**
	 * Retrieves all categories.
	 * 
	 * @return a Iterable<Category> which contains all categories. 
	 * The list can be empty if no category was found.
	 */
	@Override
	public Iterable<Category> getAll() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		logger.debug("{}: Retrieving all categories...", auth.getName());
		
		Iterable<Category> iterable = categoryRepository.findAll();
		List<Category> categories = new ArrayList<Category>();
		
		iterable.forEach( categories::add );
		
		return categories;
	}

	/**
	 * It looks for an specific category instance based on its ID which is 
	 * provided by URL.
	 * 
	 * @param id the category id that will be retrieved.
	 * 
	 * @return It returns a category instance represented by its id. If no category 
	 * was found, then an {@link EntityNotFoundException} is thrown.
	 * 
	 * @throws EntityNotFoundException if the id doesn't represent a category instance.
	 */		
	@Override
	public Category getById(String id) throws EntityNotFoundException {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		logger.debug("{}: Getting category by id {}...", auth.getName(), id);
		
		Optional<Category> optional = categoryRepository.findById(id);
		if( optional.isPresent() ) {
			Category category = optional.get();
			return category;
		}else {
			throw new EntityNotFoundException(id);
		}	
	}

	/**
	 * This method updates an existing category instance which is represented by its id.
	 * This id is specified by URL.
	 * 
	 * @param id the category instance id that will be updated.
	 * @param category the category properties to be updated.
	 * 
	 * @return the new category after the updates.
	 * 
	 * @throws EntityNotFoundException if the id doesn't represent a valid category instance.
	 * @throws MethodArgumentNotValidException if any required category data was not provided.
	 */		
	@Override
	public Category update(String id, Category entity) throws EntityNotFoundException {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		logger.debug("{}: Updating category id {}, values {}...", auth.getName(), id, entity);
		
		/*
		 * Looking for the entity based on the id provided by URL.
		 */
		Optional<Category> optional = categoryRepository.findById(id);

		if( optional.isPresent() ) {
			entity.setId(id);
			categoryRepository.save(entity);
			return entity;
		}else {
			throw new EntityNotFoundException(id);
		}
	}

	/**
	 * It creates a new category instance based on the message provided.
	 * 
	 * @param category the category that will be created.
	 * 
	 * @return the new category instance created and its id.
	 * 
	 * @throws MethodArgumentNotValidException if any required category data was not provided.
	 */	
	@Override
	public Category insert(Category entity) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		logger.debug("{}: Inserting a new category {}...", auth.getName(), entity);
		
		categoryRepository.save(entity);
		entity.setSubCategories(null);
		return entity;
	}

	/**
	 * This method deletes a existing category represented by its id 
	 * which is provided through the URL.
	 * 
	 * @param id the id that represents the category instance that will be deleted.
	 * 
	 * @throws EntityNotFoundException if the id doesn't represent a valid category instance.
	 */	
	@Override
	public void delete(String id) throws EntityNotFoundException {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		logger.debug("{}: Deleting a category id {}...", auth.getName(), id);
		
		Optional<Category> optional = categoryRepository.findById(id);
		if( optional.isPresent() ) {
			Category category = optional.get();
			
			/*
			 * Since it is a valid category, then firstly we remove the parent references.
			 */
			List<Category> subCategories = categoryRepository.findByParentId( new ObjectId( category.getId() ) );
			if( subCategories != null ) {
				subCategories.forEach(c -> c.setParentId(null));
				categoryRepository.saveAll(subCategories);
			}
			
			/*
			 * Then we delete the category from the database.
			 */
			categoryRepository.delete(category);
		}else {
			throw new EntityNotFoundException(id);
		}	
	}
}