package com.finance.domain;

import javax.validation.constraints.NotEmpty;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "creditCards")
public class CreditCard extends BaseEntity {

	@NotEmpty(message = "The name must be specified")
	private String name;

	@NotEmpty(message = "The issuer must be specified")
	private String issuer;

	@NotEmpty(message = "The number must be specified")
	private String number;

	public CreditCard(){}
	
	public CreditCard(String id, String name, String issuer, String number){
		super(id);
		this.name = name;
		this.issuer = issuer;
		this.number = number;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getIssuer() {
		return issuer;
	}

	public void setIssuer(String issuer) {
		this.issuer = issuer;
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	@Override
	public String toString() {
		return "CreditCard [name=" + name + ", issuer=" + issuer + ", number=" + number + ", id=" + id + "]";
	}
}
