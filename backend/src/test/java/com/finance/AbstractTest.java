package com.finance;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public abstract class AbstractTest {

	private static final ObjectMapper MAPPER = new ObjectMapper();
	
	protected static final String USER = "variani";
	
	protected static final String ADMIN_ROLE = "admin";
	
	protected static final String USER_ROLE = "user";
	
	protected static final String READ_ONLY_ROLE = "read-only";
	
	@Autowired
	protected WebApplicationContext webApplicationContext;
	
	protected MockMvc mockMvc;
	
	@Before
	public void setUp() {
		mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
					.apply(springSecurity())
					.build();
	}
	
	protected String toJson( Object object ) throws JsonProcessingException {
		return MAPPER.writeValueAsString(object);
	}
}
