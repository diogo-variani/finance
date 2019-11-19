package com.finance;

import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.ResultActions;

import com.finance.domain.CreditCard;
import com.finance.repository.CreditCardRepository;

public class CreditCardTest extends AbstractBaseEntityTest<CreditCard, CreditCardRepository>{

	private static final String ENDPOINT = "/api/creditCards";
	
	private static final String ENDPOINT_BY_ID = String.format("%s/{id}", ENDPOINT);
	
	private List<CreditCard> creditCards = new ArrayList<CreditCard>();

	@MockBean
	private CreditCardRepository creditCardRepository;

	@Before
	public void setUp() {
		super.setUp();
		
		creditCards.add(new CreditCard(generateId(), "Cartão Principal", "Mastercard", "123456"));
		creditCards.add(new CreditCard(generateId(), "Cartão Viagem", "Visa", "123456"));
	}

	@Override
	protected List<CreditCard> getEntities() {
		return creditCards;
	}

	@Override
	protected CreditCardRepository getRepository() {
		return creditCardRepository;
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
	protected void checkBody(ResultActions resultActions, CreditCard entity) throws Exception {
		resultActions.andExpect(jsonPath("$.id", equalTo(entity.getId())))
    	.andExpect(jsonPath("$.name", equalTo(entity.getName())))
    	.andExpect(jsonPath("$.issuer", equalTo(entity.getIssuer())))
    	.andExpect(jsonPath("$.number", equalTo(entity.getNumber())));
		
	}

	@Override
	protected void removeRequiredData(CreditCard entity) {
		entity.setName(null);
	}
}