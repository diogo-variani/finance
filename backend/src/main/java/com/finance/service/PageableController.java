package com.finance.service;

import java.beans.PropertyDescriptor;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.ValidationException;

import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

import com.finance.domain.BaseEntity;

public abstract class PageableController {
	
	public static final Integer DEFAULT_PAGE = 0;
	
	public static final Integer DEFAULT_SIZE = 10;
	
	public static final Direction DEFAULT_SORT_DIRECTION = Sort.Direction.ASC;
	
	protected PageRequest cretePageRequest( Integer page, Integer size, String sortBy, String sortDir ) {
		if( sortBy == null || sortBy.length() == 0 ) {
			return PageRequest.of( page == null || page < 0 ? DEFAULT_PAGE : page, size == null || size < 1 ? DEFAULT_SIZE : size );
		}else {
			Direction direction = sortDir == null ? DEFAULT_SORT_DIRECTION : Direction.valueOf(sortDir.toUpperCase());
			return PageRequest.of( page == null || page < 0 ? DEFAULT_PAGE : page, size == null || size < 1 ? DEFAULT_SIZE : size, direction, sortBy );
		}
	}
	
	protected <T extends BaseEntity> void validateSortFields( String sortBy, String sortDir, Class<T> entityType ) {
		
		/*
		 * If sortBy was not specified, then it doesn't need to validate 
		 * the sort fields.
		 */
		if( sortBy == null || sortBy.length() == 0) {
			return;
		}
		
		List<String> sortByFields = getSortByFields(entityType);
        
        if( !sortByFields.contains(sortBy) ) {
        	throw new ValidationException(String.format("The sortBy field doesn't contain a value valid. The possible values is/are: %s",  String.join(", ", sortByFields)));
        	//TODO: throws exception
        }
        
        if( sortDir == null ) {
        	return;
        }
        
        try {
        	Sort.Direction.valueOf(sortDir.toUpperCase());
        }catch(IllegalArgumentException e) {
        	String[] sortDirValues = Arrays.stream(Sort.Direction.values()).map(Enum::name).toArray(String[]::new);
        	throw new ValidationException(String.format("The sortDir field doesn't contain a valid value. The possible values is/are: %s", String.join(", ", sortDirValues)));
        }
        
	}
	
	private <T extends BaseEntity> List<String> getSortByFields( Class<T> entity ){		
		final BeanWrapper src = new BeanWrapperImpl(entity);
        PropertyDescriptor[] pds = src.getPropertyDescriptors();        
        return Arrays.stream(pds).map( p -> p.getName() ).collect(Collectors.toList());
	}
}
