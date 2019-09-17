package com.finance.domain;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "categories")
public class Category extends BaseEntity {

	@NotEmpty(message = "The title must be specified")
	private String title;

	private String description;

	private String parentId;
		
	@Transient
	@Valid
	private List<Category> subCategories;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<Category> getSubCategories() {
		return subCategories;
	}

	public void setSubCategories(List<Category> subCategories) {
		this.subCategories = subCategories;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	
	public boolean hasSubCategories() {
		return subCategories != null && !subCategories.isEmpty();
	}
	
	public void addSubCategory(Category subCategory) {
		if( subCategories == null ) {
			this.subCategories = new ArrayList<Category>();
		}
		
		this.subCategories.add( subCategory );
	}
	
	@Override
	public String toString() {
		return "Category [title=" + title + ", description=" + description + ", subCategories=" + subCategories + "]";
	}
}