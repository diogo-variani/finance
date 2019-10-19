package com.finance.service;

import org.springframework.web.bind.annotation.GetMapping;

import com.finance.domain.Category;

/**
 * <p>It defines the basic REST service contract of the category tree.</p>
 * 
 * <p>It exposes the main resources to allow the category tree's management.</p>
 * 
 * @author diogo.variani@gmail.com
 */
public interface ICategoryTreeService extends IEntityService<Category> {

	/**
	 * Retrieves only the root categories.
	 * 
	 * @return the root categories.
	 */	
	@GetMapping(path = "/roots", produces = "application/json")
	public Iterable<Category> getRoots();	
}