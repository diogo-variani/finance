package com.finance.util;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.hateoas.Link;

public class PageResponseBuilder {
		
	private Map<String, Object> map;
	
	private PageResponseBuilder() {	
		map = new HashMap<String, Object>();
	}
	
	private Map<String, Object> getOrCreate(String key){
		Map<String, Object> value = (Map<String, Object>) map.get(key);
		
		if( value == null ) {
			value = new HashMap<String, Object>();
			map.put(key, value);
		}
		
		return value;
	}

	public static PageResponseBuilder from(Page<?> page) {
		
		PageResponseBuilder builder = new PageResponseBuilder();
		
		builder.page( page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages() );
		builder.data( page.getContent() );
		
		return builder;
	}
	
	public PageResponseBuilder page(int number, int size, long totalElements, int totalPages) {
		
		Map<String, Object> pagination = getOrCreate("page");
		
		pagination.put("number", number);
		pagination.put("size", size);
		pagination.put("totalElements", totalElements);
		pagination.put("totalPages", totalPages);
		
		return this;
	}
	
	public PageResponseBuilder data( Object data ) {
		map.put("data", data);
		return this;
	}
	
	public PageResponseBuilder link(Link link) {
		if( link == null ) {
			return this;
		}
		
		Map<String, Object> links = getOrCreate("links");
		links.put( link.getRel(), link.getHref() );	
		
		return this;
	}
	
	public Map<String, Object> build(){
		return map;
	}
}