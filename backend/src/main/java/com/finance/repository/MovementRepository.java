package com.finance.repository;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.finance.domain.Movement;

public interface MovementRepository extends PagingAndSortingRepository<Movement, String>{

}