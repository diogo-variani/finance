package com.finance.domain;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.finance.constraint.BankAccountExist;
import com.finance.constraint.CategoryExist;
import com.finance.constraint.CreditCardExist;
import com.finance.constraint.DateAfter;

@DateAfter(base = "purchaseDate", toCheck = "paymentDate", message = "The paymentDate must be equals or after than purchaseDate")
@Document(collection = "movements")
public class Movement extends BaseEntity {

	@NotEmpty(message = "The store must be specified")
	private String store;

	//@DecimalMin(message = "The value must be at minimum 0.01", inclusive = false, value = "0.0")
	@Positive(message = "The value must be positive")
	@NotNull(message = "The value must be specified")
	private BigDecimal value;

	@CategoryExist(message = "The category specified does not exist")
	private String categoryId;

	@BankAccountExist(message = "The bank account specified does not exist")
	private String bankAccountId;

	@CreditCardExist(message = "The credit card specified does not exist")
	private String creditCardId;

	@NotNull(message = "The purchaseDate must be specified")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date purchaseDate;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date paymentDate;

	@NotNull(message = "The flat isDebit must be specified")
	private Boolean isDebit;

	public String getStore() {
		return store;
	}

	public void setStore(String store) {
		this.store = store;
	}

	public BigDecimal getValue() {
		return value;
	}

	public void setValue(BigDecimal value) {
		this.value = value;
	}

	public String getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(String categoryId) {
		this.categoryId = categoryId;
	}

	public String getBankAccountId() {
		return bankAccountId;
	}

	public void setBankAccountId(String bankAccountId) {
		this.bankAccountId = bankAccountId;
	}

	public String getCreditCardId() {
		return creditCardId;
	}

	public void setCreditCardId(String creditCardId) {
		this.creditCardId = creditCardId;
	}

	public Date getPurchaseDate() {
		return purchaseDate;
	}

	public void setPurchaseDate(Date purchaseDate) {
		this.purchaseDate = purchaseDate;
	}

	public Date getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(Date paymentDate) {
		this.paymentDate = paymentDate;
	}

	public Boolean getIsDebit() {
		return isDebit;
	}

	public void setIsDebit(Boolean isDebit) {
		this.isDebit = isDebit;
	}

	@Override
	public String toString() {
		return "Movement [store=" + store + ", value=" + value + ", categoryId=" + categoryId + ", bankAccountId="
				+ bankAccountId + ", creditCardId=" + creditCardId + ", purchaseDate=" + purchaseDate + ", paymentDate="
				+ paymentDate + ", isDebit=" + isDebit + ", id=" + id + "]";
	}
}