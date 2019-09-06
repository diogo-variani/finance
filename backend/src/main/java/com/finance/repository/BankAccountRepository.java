package com.finance.repository;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.finance.domain.BankAccount;

public interface BankAccountRepository extends PagingAndSortingRepository<BankAccount, String>{

	
}