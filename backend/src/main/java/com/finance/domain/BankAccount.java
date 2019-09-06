package com.finance.domain;

import javax.validation.constraints.NotEmpty;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "bankAccounts")
public class BankAccount extends BaseEntity {

	@NotEmpty(message = "The name must be specified")
	private String name;

	@NotEmpty(message = "The bankName must be specified")
	private String bankName;

	@NotEmpty(message = "The IBAN must be specified")
	private String iban;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	public String getIban() {
		return iban;
	}

	public void setIban(String iban) {
		this.iban = iban;
	}

	@Override
	public String toString() {
		return "BankAccount [name=" + name + ", bankName=" + bankName + ", iban=" + iban + ", id=" + id + "]";
	}
}