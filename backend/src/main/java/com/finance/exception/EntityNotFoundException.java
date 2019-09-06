package com.finance.exception;

public class EntityNotFoundException extends RuntimeException{

	private static final long serialVersionUID = -8909503753296348774L;

	public EntityNotFoundException(String id) {
		this("Entity", id);
	}
	
	public EntityNotFoundException(String entityName, String id) {
		super(String.format("%s not found [id=%s]", entityName, id));
	}
}