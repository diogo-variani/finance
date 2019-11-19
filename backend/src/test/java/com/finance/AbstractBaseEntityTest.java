package com.finance;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThan;
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

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.ObjectUtils;
import org.junit.Test;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.ResultActions;

import com.finance.domain.BaseEntity;

public abstract class AbstractBaseEntityTest<T extends BaseEntity, R extends PagingAndSortingRepository<T, String>> extends AbstractTest{

	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void getAllEntities() throws Exception {
		String endpoint = getEndpoint();
		R repository = getRepository();
		Collection<T> entities = getEntities();
		
		given(repository.findAll()).willReturn(entities);
		
		this.mockMvc.perform(get(endpoint))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(jsonPath("$", hasSize(entities.size())));
	}
	
	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void getAllEntitiesWithEmptyList() throws Exception {
		String endpoint = getEndpoint();
		R repository = getRepository();
		
		given(repository.findAll()).willReturn(Collections.<T>emptyList());
		
		this.mockMvc.perform(get(endpoint))
        	.andExpect(status().isOk())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$", hasSize(0)));
	}
	
	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void getEntityById() throws Exception {
		List<T> entities = getEntities();
		R repository = getRepository();
		String endpoint = getEndpointById();
		
		T entity = entities.get(0);
		String id = entity.getId();
		
		given(repository.findById(id)).willReturn(Optional.of(entity));
		
		ResultActions resultActions = this.mockMvc.perform(get(endpoint, id))
        	.andExpect(status().isOk());
		
		checkBody( resultActions, entity );
	}
	
	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void getEntityByIdNotFound() throws Exception {
		String endpoint = getEndpointById();
		List<T> entities = getEntities();
		
		T entity = entities.get(0);
		String id = entity.getId();
		
		R repository = getRepository();
		
		given(repository.findById(id)).willReturn(Optional.empty());
		
		this.mockMvc.perform(get(endpoint, id))
        	.andExpect(status().isNotFound())
        	/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
	}
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)
	public void insertEntity() throws Exception {
		String endpoint = getEndpoint();
		List<T> entities = getEntities();
		
		T entity = entities.get(0);
		String payload = toJson(entity);
		
		R repository = getRepository();
		
		given(repository.save(entity)).willReturn(entity);
		
		ResultActions resultActions = this.mockMvc.perform(post(endpoint).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
			/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(status().isCreated())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
		
		checkBody( resultActions, entity );
	}
	
	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void insertEntityForbidden() throws Exception {
		String endpoint = getEndpoint();
		List<T> entities = getEntities();
		
		T entity = entities.get(0);
		String payload = toJson(entity);
		
		this.mockMvc.perform(post(endpoint).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
			/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(status().isForbidden())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
	}
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)
	public void insertEntityMissingRequiredData() throws Exception {
		String endpoint = getEndpoint();
		List<T> entities = getEntities();
		
		T entity = entities.get(0);
		T clone = ObjectUtils.clone(entity);
		
		removeRequiredData(clone);
		String payload = toJson(clone);
		
		this.mockMvc.perform(post(endpoint).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
			/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(status().isBadRequest())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.description", equalTo("Payload is not valid")))
        	.andExpect(jsonPath("$.errors", hasSize( greaterThan(0) ) ));
	}
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)
	public void updateEntity() throws Exception {
		String endpoint = getEndpointById();
		R repository = getRepository();
		
		List<T> entities = getEntities();
		T entity = entities.get(0);
		
		String id = entity.getId();
		String payload = toJson(entity);
		
		given(repository.findById(id)).willReturn(Optional.of(entity));
		given(repository.save(entity)).willReturn(entity);
		
		ResultActions resultActions = this.mockMvc.perform(put(endpoint, id).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
			/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(status().isOk())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
        	
		checkBody(resultActions, entity);
	}
	
	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void updateEntityForbidden() throws Exception {
		String endpoint = getEndpointById();
		
		List<T> entities = getEntities();
		T entity = entities.get(0);
		
		String id = entity.getId();
		String payload = toJson(entity);
		
		this.mockMvc.perform(put(endpoint, id).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
			/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(status().isForbidden())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
	}
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)
	public void updateEntityNotFound() throws Exception {
		String endpoint = getEndpointById();
		
		List<T> entities = getEntities();
		T entity = entities.get(0);
		
		String id = entity.getId();
		String payload = toJson(entity);
		
		R repository = getRepository();
		
		given(repository.findById(id)).willReturn(Optional.empty());
		
		this.mockMvc.perform(put(endpoint, id).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
			/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(status().isNotFound())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
	}
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)
	public void updateEntityMissingRequiredData() throws Exception {
		String endpoint = getEndpointById();
		
		List<T> entities = getEntities();
		T entity = entities.get(0);

		String id = entity.getId();

		T clone = ObjectUtils.clone(entity);
		removeRequiredData(clone);
		
		String payload = toJson(clone);
		
		this.mockMvc.perform(put(endpoint, id).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
			/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(status().isBadRequest())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.description", equalTo("Payload is not valid")))
        	.andExpect(jsonPath("$.errors", hasSize( greaterThan(0) ) ));
	}
	
	@Test
	@WithMockUser(username = USER, roles = ADMIN_ROLE)
	public void deleteEntity() throws Exception {
		String endpoint = getEndpointById();
		
		List<T> entities = getEntities();

		T entity = entities.get(0);
		String id = entity.getId();
		
		R repository = getRepository();
		
		given(repository.findById(id)).willReturn(Optional.of(entity));
		willDoNothing().given(repository).delete(entity);
		
		this.mockMvc.perform(delete(endpoint, id))
			/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(status().isOk());
	}
	
	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void deleteEntityForbidden() throws Exception {
		String endpoint = getEndpointById();
		
		List<T> entities = getEntities();

		T entity = entities.get(0);
		String id = entity.getId();
		
		this.mockMvc.perform(delete(endpoint, id))
			/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(status().isForbidden());
	}
	
	@Test
	@WithMockUser(username = USER, roles = ADMIN_ROLE)
	public void deleteEntityNotFound() throws Exception {
		String endpoint = getEndpointById();
		
		List<T> entities = getEntities();

		T entity = entities.get(0);
		String id = entity.getId();
		
		R repository = getRepository();
		
		given(repository.findById(id)).willReturn(Optional.empty());
		
		this.mockMvc.perform(delete(endpoint, id))
			/*.andDo(MockMvcResultHandlers.print())*/
        	.andExpect(status().isNotFound())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
	}	
	
	protected abstract List<T> getEntities();
	
	protected abstract R getRepository();
	
	protected abstract String getEndpoint();
	
	protected abstract String getEndpointById();
	
	protected abstract void checkBody( ResultActions resultActions, T entity ) throws Exception;
	
	protected abstract void removeRequiredData( T entity );
}
