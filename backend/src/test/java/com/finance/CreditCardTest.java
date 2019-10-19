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

import com.finance.domain.CreditCard;
import com.finance.repository.CreditCardRepository;

public class CreditCardTest extends AbstractTest{

	private static final String ENDPOINT = "/api/creditCards";
	
	private static final String ENDPOINT_BY_ID = String.format("%s/{id}", ENDPOINT);
	
	private List<CreditCard> creditCards = new ArrayList<CreditCard>();

	@MockBean
	private CreditCardRepository creditCardRepository;

	@Before
	public void setUp() {
		super.setUp();
		
		creditCards.add(new CreditCard("1", "Cartão Principal", "Mastercard", "123456"));
		creditCards.add(new CreditCard("2", "Cartão Viagem", "Visa", "123456"));
	}

	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void getAllCreditCards() throws Exception {
		given(creditCardRepository.findAll()).willReturn(creditCards);
		
		this.mockMvc.perform(get(ENDPOINT))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(jsonPath("$", hasSize(creditCards.size())));
	}
	
	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void getAllWithEmptyList() throws Exception {
		given(creditCardRepository.findAll()).willReturn(Collections.<CreditCard>emptyList());
		
		this.mockMvc.perform(get(ENDPOINT))
        	.andExpect(status().isOk())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$", hasSize(0)));
	}
	
	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void getCreditCardById() throws Exception {
		CreditCard creditCard = creditCards.get(0);
		String id = creditCard.getId();
		
		given(creditCardRepository.findById(id)).willReturn(Optional.of(creditCard));
		
		this.mockMvc.perform(get(ENDPOINT_BY_ID, id))
        	.andExpect(status().isOk())
        	/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.id", equalTo(creditCard.getId())))
        	.andExpect(jsonPath("$.name", equalTo(creditCard.getName())))
        	.andExpect(jsonPath("$.issuer", equalTo(creditCard.getIssuer())))
        	.andExpect(jsonPath("$.number", equalTo(creditCard.getNumber())));
	}
	
	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void getCreditCardByIdNotFound() throws Exception {
		CreditCard creditCard = creditCards.get(0);
		String id = creditCard.getId();
		
		given(creditCardRepository.findById(id)).willReturn(Optional.empty());
		
		this.mockMvc.perform(get(ENDPOINT_BY_ID, id))
        	.andExpect(status().isNotFound())
        	/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
	}	
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)
	public void insertCreditCard() throws Exception {
		CreditCard creditCard = creditCards.get(0);
		String payload = toJson(creditCard);
		
		given(creditCardRepository.save(creditCard)).willReturn(creditCard);
		
		this.mockMvc.perform(post(ENDPOINT).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
			/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(status().isCreated())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.id", equalTo(creditCard.getId())))
        	.andExpect(jsonPath("$.name", equalTo(creditCard.getName())))
        	.andExpect(jsonPath("$.issuer", equalTo(creditCard.getIssuer())))
        	.andExpect(jsonPath("$.number", equalTo(creditCard.getNumber())));
	}
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)
	public void insertCreditCardMissingRequiredData() throws Exception {
		CreditCard creditCard = creditCards.get(0);
		
		CreditCard clone = new CreditCard();
		BeanUtils.copyProperties(creditCard, clone);
		clone.setName(null);
		
		String payload = toJson(clone);
		
		this.mockMvc.perform(post(ENDPOINT).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
			/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(status().isBadRequest())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.description", equalTo("Payload is not valid")))
        	.andExpect(jsonPath("$.errors[0]", equalTo("The name must be specified")));
	}	
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)
	public void updateCreditCard() throws Exception {
		CreditCard creditCard = creditCards.get(0);
		String id = creditCard.getId();
		String payload = toJson(creditCard);
		
		given(creditCardRepository.findById(id)).willReturn(Optional.of(creditCard));
		given(creditCardRepository.save(creditCard)).willReturn(creditCard);
		
		this.mockMvc.perform(put(ENDPOINT_BY_ID, id).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
			/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(status().isOk())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.id", equalTo(creditCard.getId())))
        	.andExpect(jsonPath("$.name", equalTo(creditCard.getName())))
        	.andExpect(jsonPath("$.issuer", equalTo(creditCard.getIssuer())))
        	.andExpect(jsonPath("$.number", equalTo(creditCard.getNumber())));
	}
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)
	public void updateCreditCardMissingRequiredData() throws Exception {
		CreditCard creditCard = creditCards.get(0);
		String id = creditCard.getId();
		
		CreditCard clone = new CreditCard();
		BeanUtils.copyProperties(creditCard, clone);
		clone.setName(null);
		
		String payload = toJson(clone);
		
		this.mockMvc.perform(put(ENDPOINT_BY_ID, id).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
			/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(status().isBadRequest())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.description", equalTo("Payload is not valid")))
        	.andExpect(jsonPath("$.errors[0]", equalTo("The name must be specified")));
	}	
	
	@Test
	@WithMockUser(username = USER, roles = ADMIN_ROLE)
	public void deleteCreditCard() throws Exception {
		CreditCard creditCard = creditCards.get(0);
		String id = creditCard.getId();
		
		given(creditCardRepository.findById(id)).willReturn(Optional.of(creditCard));
		willDoNothing().given(creditCardRepository).delete(creditCard);
		
		this.mockMvc.perform(delete(ENDPOINT_BY_ID, id))
			/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(status().isOk());
	}
	
	@Test
	@WithMockUser(username = USER, roles = ADMIN_ROLE)
	public void deleteCreditCardNotFound() throws Exception {
		CreditCard creditCard = creditCards.get(0);
		String id = creditCard.getId();
		
		given(creditCardRepository.findById(id)).willReturn(Optional.empty());
		
		this.mockMvc.perform(delete(ENDPOINT_BY_ID, id))
			/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(status().isNotFound())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
	}	
}