package com.finance;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.BeanUtils;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;

import com.finance.domain.BankAccount;
import com.finance.repository.BankAccountRepository;

public class BankAccountTest extends AbstractTest{

	private static final String ENDPOINT = "/api/bankAccounts";
	
	private static final String ENDPOINT_BY_ID = String.format("%s/{id}", ENDPOINT);
	
	private List<BankAccount> bankAccounts = new ArrayList<BankAccount>();

	@MockBean
	private BankAccountRepository bankAccountRepository;

	@Before
	public void setUp() {
		super.setUp();
		
		bankAccounts.add(new BankAccount("1", "Conta Principal", "Montepio", "123456"));
		bankAccounts.add(new BankAccount("2", "Conta Poupança", "Caixa Geral de Depósitos", "123456"));
	}

	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void getAllBankAccounts() throws Exception {
		given(bankAccountRepository.findAll()).willReturn(bankAccounts);
		
		this.mockMvc.perform(get(ENDPOINT))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(jsonPath("$", hasSize(bankAccounts.size())));
	}
	
	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void getAllWithEmptyList() throws Exception {
		given(bankAccountRepository.findAll()).willReturn(Collections.<BankAccount>emptyList());
		
		this.mockMvc.perform(get(ENDPOINT))
        	.andExpect(status().isOk())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$", hasSize(0)));
	}
	
	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void getBankAccountById() throws Exception {
		BankAccount bankAccount = bankAccounts.get(0);
		String id = bankAccount.getId();
		
		given(bankAccountRepository.findById(id)).willReturn(Optional.of(bankAccount));
		
		this.mockMvc.perform(get(ENDPOINT_BY_ID, id))
        	.andExpect(status().isOk())
        	/*.andDo(print())*/
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.id", equalTo(bankAccount.getId())))
        	.andExpect(jsonPath("$.name", equalTo(bankAccount.getName())))
        	.andExpect(jsonPath("$.bankName", equalTo(bankAccount.getBankName())))
        	.andExpect(jsonPath("$.iban", equalTo(bankAccount.getIban())));
	}
	
	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void getBankAccountByIdNotFound() throws Exception {
		BankAccount bankAccount = bankAccounts.get(0);
		String id = bankAccount.getId();
		
		given(bankAccountRepository.findById(id)).willReturn(Optional.empty());
		
		this.mockMvc.perform(get(ENDPOINT_BY_ID, id))
        	.andExpect(status().isNotFound())
        	/*.andDo(print())*/
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
	}	
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)
	public void insertBankAccount() throws Exception {
		BankAccount bankAccount = bankAccounts.get(0);
		String payload = toJson(bankAccount);
		
		given(bankAccountRepository.save(bankAccount)).willReturn(bankAccount);
		
		this.mockMvc.perform(post(ENDPOINT).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
			/*.andDo(print())*/
        	.andExpect(status().isCreated())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.id", equalTo(bankAccount.getId())))
        	.andExpect(jsonPath("$.name", equalTo(bankAccount.getName())))
        	.andExpect(jsonPath("$.bankName", equalTo(bankAccount.getBankName())))
        	.andExpect(jsonPath("$.iban", equalTo(bankAccount.getIban())));
	}
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)
	public void insertBankAccountMissingRequiredData() throws Exception {
		BankAccount bankAccount = bankAccounts.get(0);
		
		BankAccount clone = new BankAccount();
		BeanUtils.copyProperties(bankAccount, clone);
		clone.setName(null);
		
		String payload = toJson(clone);
		
		System.out.println(payload);
		
		this.mockMvc.perform(post(ENDPOINT).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
			/*.andDo(print())*/
        	.andExpect(status().isBadRequest())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.description", equalTo("Payload is not valid")))
        	.andExpect(jsonPath("$.errors[0]", equalTo("The name must be specified")));
	}	
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)
	public void updateBankAccount() throws Exception {
		BankAccount bankAccount = bankAccounts.get(0);
		String id = bankAccount.getId();
		String payload = toJson(bankAccount);
		
		given(bankAccountRepository.findById(id)).willReturn(Optional.of(bankAccount));
		given(bankAccountRepository.save(bankAccount)).willReturn(bankAccount);
		
		this.mockMvc.perform(put(ENDPOINT_BY_ID, id).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
			/*.andDo(print())*/
        	.andExpect(status().isOk())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.id", equalTo(bankAccount.getId())))
        	.andExpect(jsonPath("$.name", equalTo(bankAccount.getName())))
        	.andExpect(jsonPath("$.bankName", equalTo(bankAccount.getBankName())))
        	.andExpect(jsonPath("$.iban", equalTo(bankAccount.getIban())));
	}
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)
	public void updateBankAccountMissingRequiredData() throws Exception {
		BankAccount bankAccount = bankAccounts.get(0);
		String id = bankAccount.getId();
		
		BankAccount clone = new BankAccount();
		BeanUtils.copyProperties(bankAccount, clone);
		clone.setName(null);
		
		String payload = toJson(clone);
		
		this.mockMvc.perform(put(ENDPOINT_BY_ID, id).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
			/*.andDo(print())*/
        	.andExpect(status().isBadRequest())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.description", equalTo("Payload is not valid")))
        	.andExpect(jsonPath("$.errors[0]", equalTo("The name must be specified")));
	}	
	
	@Test
	@WithMockUser(username = USER, roles = ADMIN_ROLE)
	public void deleteBankAccount() throws Exception {
		BankAccount bankAccount = bankAccounts.get(0);
		String id = bankAccount.getId();
		
		given(bankAccountRepository.findById(id)).willReturn(Optional.of(bankAccount));
		willDoNothing().given(bankAccountRepository).delete(bankAccount);
		
		this.mockMvc.perform(delete(ENDPOINT_BY_ID, id))
			/*.andDo(print())*/
        	.andExpect(status().isOk());
	}
	
	@Test
	@WithMockUser(username = USER, roles = ADMIN_ROLE)
	public void deleteBankAccountNotFound() throws Exception {
		BankAccount bankAccount = bankAccounts.get(0);
		String id = bankAccount.getId();
		
		given(bankAccountRepository.findById(id)).willReturn(Optional.empty());
		
		this.mockMvc.perform(delete(ENDPOINT_BY_ID, id))
			/*.andDo(print())*/
        	.andExpect(status().isNotFound())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
	}	
}