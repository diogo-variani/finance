package com.finance.util;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Date;

import com.finance.domain.QMovement;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;

public class MovementFilterBuilder {

	private BooleanBuilder booleanBuilder;
	
	private MovementFilterBuilder() {
		booleanBuilder = new BooleanBuilder();
	}
	
	public static MovementFilterBuilder start() {
		MovementFilterBuilder builder = new MovementFilterBuilder();
		return builder;
	}
	
	public MovementFilterBuilder store( String store ) {
		if( store == null || store.length() == 0 ) {
			return this;
		}
		
		add( QMovement.movement.store.containsIgnoreCase(store) );
		
		return this;
	}
	
	public MovementFilterBuilder values( BigDecimal initialValue, BigDecimal finalValue ) {
		if( initialValue == null && finalValue == null ) {
			return this;
		}
		
		if( initialValue != null && finalValue != null ) {
			add( QMovement.movement.value.between( initialValue, finalValue ) );
		}else if( initialValue != null ) {
			add( QMovement.movement.value.goe( initialValue ) );
		}else if( finalValue != null ) {
			add( QMovement.movement.value.loe( finalValue ) );
		}
		
		return this;
	}

	public MovementFilterBuilder categoryIds( String... categoryIds ) {
		if( categoryIds == null || categoryIds.length == 0) {
			return this;
		}
		
		categoryIds = Arrays.asList( categoryIds ).stream().filter( c -> c != null ).toArray(String[]::new);
		
		if( categoryIds == null || categoryIds.length == 0) {
			return this;
		}
		
		add( QMovement.movement.categoryId.in(categoryIds) );
		
		return this;
	}
	
	public MovementFilterBuilder bankAccountIds( String... bankAccountIds ) {
		if( bankAccountIds == null || bankAccountIds.length == 0) {
			return this;
		}
		
		add( QMovement.movement.bankAccountId.in(bankAccountIds) );
		
		return this;
	}
	
	public MovementFilterBuilder creditCardIds( String... creditCardIds ) {
		if( creditCardIds == null || creditCardIds.length == 0) {
			return this;
		}
		
		add( QMovement.movement.creditCardId.in(creditCardIds) );
		
		return this;
	}
	
	public MovementFilterBuilder paymentDate( Date paymentInitialDate, Date paymentFinalDate ) {
		if( paymentInitialDate == null && paymentFinalDate == null) {
			return this;
		}
		
		if( paymentInitialDate != null ) {
			add( QMovement.movement.paymentDate.goe(paymentInitialDate) );
		}
		
		if( paymentFinalDate != null ) {
			add( QMovement.movement.paymentDate.loe(paymentFinalDate) );
		}
		
		return this;
	}
	
	public MovementFilterBuilder purchaseDate( Date purchaseInitialDate, Date purchaseFinalDate ) {
		if( purchaseInitialDate == null && purchaseFinalDate == null) {
			return this;
		}
		
		if( purchaseInitialDate != null ) {
			add( QMovement.movement.purchaseDate.goe(purchaseInitialDate) );
		}
		
		if( purchaseFinalDate != null ) {
			add( QMovement.movement.purchaseDate.loe(purchaseFinalDate) );
		}
		
		return this;
	}
	
	private void add( Predicate predicate ) {
		booleanBuilder.and(predicate);
	}

	public Predicate build() {
		return booleanBuilder.getValue();
	}
}