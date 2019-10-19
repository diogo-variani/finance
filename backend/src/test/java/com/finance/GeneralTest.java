package com.finance;

import static org.hamcrest.Matchers.equalTo;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;

import com.finance.repository.CreditCardRepository;
import com.mongodb.MongoSocketOpenException;

public class GeneralTest extends AbstractTest{

	@MockBean
	private CreditCardRepository creditCardRepository;
	
	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void testDatabaseDown() throws Exception {
		given(creditCardRepository.findAll()).willThrow(MongoSocketOpenException.class);
		
		this.mockMvc.perform(get("/api/creditCards"))
        .andExpect(status().isInternalServerError())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(jsonPath("$.status", equalTo(500)))
        .andExpect(jsonPath("$.description", equalTo("Internal Server Error")));
	}
}
