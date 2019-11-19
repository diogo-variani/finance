package com.finance;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.ObjectUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import com.finance.domain.BankAccount;
import com.finance.domain.Category;
import com.finance.domain.CreditCard;
import com.finance.domain.Movement;
import com.finance.repository.BankAccountRepository;
import com.finance.repository.CategoryRepository;
import com.finance.repository.CreditCardRepository;
import com.finance.repository.MovementRepository;
import com.finance.service.PageableController;

public class MovementTest extends AbstractBaseEntityTest<Movement, MovementRepository>{

	private static final String ENDPOINT = "/api/movements";
	
	private static final String ENDPOINT_BY_ID = String.format("%s/{id}", ENDPOINT);
	
	private Category category;
	private BankAccount bankAccount;
	private CreditCard creditCard;
	private List<Movement> movements = new ArrayList<Movement>();

	@MockBean
	private MovementRepository movementRepository;
	
	@MockBean
	private BankAccountRepository bankAccountRepository;	

	@MockBean
	private CreditCardRepository creditCardRepository;	

	@MockBean
	private CategoryRepository categoryRepository;	
	
	@Before
	public void setUp() {
		super.setUp();
		
		bankAccount = new BankAccount(generateId(), "Conta Principal", "Montepio", "123456");
		category = new Category(generateId(), "Title 1", "Description 1", null);
		creditCard = new CreditCard(generateId(), "Cartão Principal", "Mastercard", "123456");
		
		movements.add(new Movement(generateId(), "Store 1", new BigDecimal(100.01), category.getId(), bankAccount.getId(), creditCard.getId(), Calendar.getInstance().getTime(), null, true));
		movements.add(new Movement(generateId(), "Store 2", new BigDecimal(100.01), category.getId(), bankAccount.getId(), creditCard.getId(), Calendar.getInstance().getTime(), null, true));
		movements.add(new Movement(generateId(), "Store 3", new BigDecimal(100.01), category.getId(), bankAccount.getId(), creditCard.getId(), Calendar.getInstance().getTime(), Calendar.getInstance().getTime(), true));
		movements.add(new Movement(generateId(), "Store 4", new BigDecimal(100.01), category.getId(), bankAccount.getId(), creditCard.getId(), Calendar.getInstance().getTime(), null, false));
		
	}

	@Override
	protected List<Movement> getEntities() {
		return movements;
	}

	@Override
	protected MovementRepository getRepository() {
		return movementRepository;
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
	protected void checkBody(ResultActions resultActions, Movement entity) throws Exception {
    	resultActions.andExpect(jsonPath("$.id", equalTo(entity.getId())))
//    	.andDo(MockMvcResultHandlers.print())
    	.andExpect(jsonPath("$.store", equalTo(entity.getStore())))
    	.andExpect(jsonPath("$.value", equalTo(entity.getValue())))
    	.andExpect(jsonPath("$.isDebit", equalTo(entity.getIsDebit())));
	}

	@Override
	protected void removeRequiredData(Movement entity) {
		entity.setStore(null);
	}

	@Override
	public void getAllEntities() throws Exception {
		PageRequest pageRequest = PageRequest.of( PageableController.DEFAULT_PAGE, PageableController.DEFAULT_SIZE );
		Page<Movement> pageResponse = new PageImpl<Movement>(movements);
		
		given(movementRepository.findAll(pageRequest)).willReturn(pageResponse);
		
		this.mockMvc.perform(get(ENDPOINT))
	//		.andDo(MockMvcResultHandlers.print())
	        .andExpect(status().isOk())
	        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
	        .andExpect(jsonPath("$.page.totalPages", equalTo(1)))
	        .andExpect(jsonPath("$.page.totalElements", equalTo(movements.size())))
	        .andExpect(jsonPath("$.data", hasSize(movements.size())));
	}

	@Override
	public void getAllEntitiesWithEmptyList() throws Exception {
		PageRequest pageRequest = PageRequest.of( PageableController.DEFAULT_PAGE, PageableController.DEFAULT_SIZE );
		Page<Movement> pageResponse = Page.<Movement>empty();
		
		given(movementRepository.findAll(pageRequest)).willReturn(pageResponse);
		
		this.mockMvc.perform(get(ENDPOINT))
//			.andDo(MockMvcResultHandlers.print())
	        .andExpect(status().isOk())
	        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
	        .andExpect(jsonPath("$.page.totalPages", equalTo(1)))
	        .andExpect(jsonPath("$.page.totalElements", equalTo(0)))
	        .andExpect(jsonPath("$.data", hasSize(0)));		
	}

	@Override
	public void updateEntity() throws Exception {
		given(bankAccountRepository.findById(bankAccount.getId())).willReturn(Optional.of(bankAccount));
		given(categoryRepository.findById(category.getId())).willReturn(Optional.of(category));
		given(creditCardRepository.findById(creditCard.getId())).willReturn(Optional.of(creditCard));
		
		super.updateEntity();
	}

	@Override
	public void updateEntityForbidden() throws Exception {
		given(bankAccountRepository.findById(bankAccount.getId())).willReturn(Optional.of(bankAccount));
		given(categoryRepository.findById(category.getId())).willReturn(Optional.of(category));
		given(creditCardRepository.findById(creditCard.getId())).willReturn(Optional.of(creditCard));
		
		super.updateEntityForbidden();
	}

	@Override
	public void updateEntityNotFound() throws Exception {
		given(bankAccountRepository.findById(bankAccount.getId())).willReturn(Optional.of(bankAccount));
		given(categoryRepository.findById(category.getId())).willReturn(Optional.of(category));
		given(creditCardRepository.findById(creditCard.getId())).willReturn(Optional.of(creditCard));

		super.updateEntityNotFound();
	}

	@Override
	public void insertEntity() throws Exception {
		given(bankAccountRepository.findById(bankAccount.getId())).willReturn(Optional.of(bankAccount));
		given(categoryRepository.findById(category.getId())).willReturn(Optional.of(category));
		given(creditCardRepository.findById(creditCard.getId())).willReturn(Optional.of(creditCard));

		super.insertEntity();
	}
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)	
	public void insertEntityInvalidBankAccount() throws Exception{
		Movement entity = movements.get(0);
		String payload = toJson(entity);
		
		given(movementRepository.save(entity)).willReturn(entity);
		given(bankAccountRepository.findById(bankAccount.getId())).willReturn(Optional.empty());
		given(categoryRepository.findById(category.getId())).willReturn(Optional.of(category));
		given(creditCardRepository.findById(creditCard.getId())).willReturn(Optional.of(creditCard));
		
		mockMvc.perform(post(ENDPOINT).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
//			.andDo(MockMvcResultHandlers.print())
        	.andExpect(status().isBadRequest())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.errors[0]", equalTo("The bank account specified does not exist")));
	}
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)	
	public void insertEntityInvalidCategory() throws Exception{
		Movement entity = movements.get(0);
		String payload = toJson(entity);
		
		given(movementRepository.save(entity)).willReturn(entity);
		given(bankAccountRepository.findById(bankAccount.getId())).willReturn(Optional.of(bankAccount));
		given(categoryRepository.findById(category.getId())).willReturn(Optional.empty());
		given(creditCardRepository.findById(creditCard.getId())).willReturn(Optional.of(creditCard));
		
		mockMvc.perform(post(ENDPOINT).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
//			.andDo(MockMvcResultHandlers.print())
        	.andExpect(status().isBadRequest())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.errors[0]", equalTo("The category specified does not exist")));
	}
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)	
	public void insertEntityInvalidCreditCard() throws Exception{
		Movement entity = movements.get(0);
		String payload = toJson(entity);
		
		given(movementRepository.save(entity)).willReturn(entity);
		given(bankAccountRepository.findById(bankAccount.getId())).willReturn(Optional.of(bankAccount));
		given(categoryRepository.findById(category.getId())).willReturn(Optional.of(category));
		given(creditCardRepository.findById(creditCard.getId())).willReturn(Optional.empty());
		
		mockMvc.perform(post(ENDPOINT).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
//			.andDo(MockMvcResultHandlers.print())
        	.andExpect(status().isBadRequest())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.errors[0]", equalTo("The credit card specified does not exist")));
	}
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)	
	public void insertEntityInvalidDates() throws Exception{
		Movement entity = movements.get(0);
		Movement clone = ObjectUtils.clone(entity);
		
		Date purchaseDate = Calendar.getInstance().getTime();
		
		Calendar calendar = Calendar.getInstance();
		calendar.roll(Calendar.DAY_OF_MONTH, -2);
		Date paymentDate = calendar.getTime();
		
		clone.setPurchaseDate(purchaseDate);
		clone.setPaymentDate(paymentDate);
		
		String payload = toJson(clone);
		
		given(movementRepository.save(entity)).willReturn(entity);
		given(bankAccountRepository.findById(bankAccount.getId())).willReturn(Optional.of(bankAccount));
		given(categoryRepository.findById(category.getId())).willReturn(Optional.of(category));
		given(creditCardRepository.findById(creditCard.getId())).willReturn(Optional.of(creditCard));
		
		mockMvc.perform(post(ENDPOINT).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
//			.andDo(MockMvcResultHandlers.print())
        	.andExpect(status().isBadRequest())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.errors[0]", equalTo("The paymentDate must be equals or after than purchaseDate")));
	}	

	@Override
	public void insertEntityForbidden() throws Exception {
		given(bankAccountRepository.findById(bankAccount.getId())).willReturn(Optional.of(bankAccount));
		given(categoryRepository.findById(category.getId())).willReturn(Optional.of(category));
		given(creditCardRepository.findById(creditCard.getId())).willReturn(Optional.of(creditCard));

		super.insertEntityForbidden();
	}
	

	@Test
	@WithMockUser(username = USER, roles = ADMIN_ROLE)
	public void deleteEntities() throws Exception {
		String[] ids = movements.stream().map( m -> m.getId() ).toArray(String[]::new);
		
		given(movementRepository.findAllById(Arrays.asList(ids))).willReturn(movements);
		willDoNothing().given(movementRepository).deleteAll(movements);
		
		mockMvc.perform(delete(ENDPOINT).param("ids", ids))
			/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(status().isOk());
	}

}