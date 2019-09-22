package com.finance.service;

import org.springframework.data.domain.PageRequest;

public abstract class PageableController {

	int DEFAULT_PAGE = 1;
	
	int DEFAULT_SIZE = 10;
	
	protected PageRequest cretePageRequest( int page, int size ) {
		return PageRequest.of( page == 0 ? DEFAULT_PAGE : page, size == 0 ? DEFAULT_SIZE : size );
	}
}
