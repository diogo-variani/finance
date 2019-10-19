package com.finance.repository;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.finance.domain.CreditCard;

public interface CreditCardRepository extends PagingAndSortingRepository<CreditCard, String>{

}