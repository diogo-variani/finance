package com.finance;

import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.test.web.servlet.ResultActions;

import com.finance.domain.BankAccount;
import com.finance.repository.BankAccountRepository;

public class BankAccountTest extends AbstractBaseEntityTest<BankAccount, PagingAndSortingRepository<BankAccount, String>>{

	private static final String ENDPOINT = "/api/bankAccounts";
	
	private static final String ENDPOINT_BY_ID = String.format("%s/{id}", ENDPOINT);
	
	private List<BankAccount> bankAccounts = new ArrayList<BankAccount>();

	@MockBean
	private BankAccountRepository bankAccountRepository;

	@Before
	public void setUp() {
		super.setUp();
		
		bankAccounts.add(new BankAccount(generateId(), "Conta Principal", "Montepio", "123456"));
		bankAccounts.add(new BankAccount(generateId(), "Conta Poupança", "Caixa Geral de Depósitos", "123456"));
	}

	@Override
	protected List<BankAccount> getEntities() {
		return bankAccounts;
	}

	@Override
	protected PagingAndSortingRepository<BankAccount, String> getRepository() {
		return bankAccountRepository;
	}

	@Override
	protected String getEndpoint() {
		return ENDPOINT;
	}

	@Override
	protected String getEndpointById() {
		return ENDPOINT_BY_ID;
	}

	@Override
	protected void checkBody(ResultActions resultActions, BankAccount entity) throws Exception {
		resultActions.andExpect(jsonPath("$.id", equalTo(entity.getId())))
    	.andExpect(jsonPath("$.name", equalTo(entity.getName())))
    	.andExpect(jsonPath("$.bankName", equalTo(entity.getBankName())))
    	.andExpect(jsonPath("$.iban", equalTo(entity.getIban())));
	}

	@Override
	protected void removeRequiredData(BankAccount entity) {
		entity.setName(null);
	}
}