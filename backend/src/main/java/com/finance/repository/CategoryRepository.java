package com.finance.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.finance.domain.Category;

public interface CategoryRepository extends PagingAndSortingRepository<Category, String>{

	public List<Category> findByParentId(String parentId);
	
	public Optional<Category> findByTitle(String title);
}