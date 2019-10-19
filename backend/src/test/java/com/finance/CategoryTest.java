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
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.BeanUtils;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;

import com.finance.domain.Category;
import com.finance.repository.CategoryRepository;

public class CategoryTest extends AbstractTest{

	private static final String ENDPOINT = "/api/categories";
	
	private static final String ENDPOINT_BY_ID = String.format("%s/{id}", ENDPOINT);

	private List<Category> roots = new ArrayList<Category>();
	private List<Category> categories = new ArrayList<Category>();

	@MockBean
	private CategoryRepository categoryRepository;

	@Before
	public void setUp() {
		super.setUp();
		
		roots.add(new Category("5d94bf0bcb4f0dac41358011", "Title 1", "Description 1", null));
		roots.add(new Category("5d94bf0bcb4f0dac41358012", "Title 2", "Description 2", null));
		
		categories.addAll(roots);
		categories.add(new Category("3", "Title 3", "Description 3", null));
		
		categories.add(new Category("4", "Title 4", "Description 4", "5d94bf0bcb4f0dac41358011"));
		categories.add(new Category("5", "Title 5", "Description 5", "5d94bf0bcb4f0dac41358011"));
		
		categories.add(new Category("6", "Title 6", "Description 6", "5d94bf0bcb4f0dac41358012"));
		categories.add(new Category("7", "Title 7", "Description 7", "5d94bf0bcb4f0dac41358012"));
	}

	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void getAllCategories() throws Exception {
		given(categoryRepository.findAll()).willReturn(categories);
		
		this.mockMvc.perform(get(ENDPOINT))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(jsonPath("$", hasSize(categories.size())));
	}
	
	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void getAllWithEmptyList() throws Exception {
		given(categoryRepository.findAll()).willReturn(Collections.<Category>emptyList());
		
		this.mockMvc.perform(get(ENDPOINT))
        	.andExpect(status().isOk())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$", hasSize(0)));
	}
	
	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void getCategoryById() throws Exception {
		Category category = categories.get(0);
		String id = category.getId();
		
		given(categoryRepository.findById(id)).willReturn(Optional.of(category));
		
		this.mockMvc.perform(get(ENDPOINT_BY_ID, id))
        	.andExpect(status().isOk())
        	/*.andDo(print())*/
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.id", equalTo(category.getId())))
        	.andExpect(jsonPath("$.description", equalTo(category.getDescription())))
        	.andExpect(jsonPath("$.title", equalTo(category.getTitle())));
	}
	
	@Test
	@WithMockUser(username = USER, roles = READ_ONLY_ROLE)
	public void getCategoryByIdNotFound() throws Exception {
		Category category = categories.get(0);
		String id = category.getId();
		
		given(categoryRepository.findById(id)).willReturn(Optional.empty());
		
		this.mockMvc.perform(get(ENDPOINT_BY_ID, id))
        	.andExpect(status().isNotFound())
        	/*.andDo(print())*/
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
	}	
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)
	public void insertCategory() throws Exception {
		Category category = categories.get(0);
		String payload = toJson(category);
		
		given(categoryRepository.save(category)).willReturn(category);
		
		this.mockMvc.perform(post(ENDPOINT).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
			/*.andDo(print())*/
        	.andExpect(status().isCreated())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.id", equalTo(category.getId())))
        	.andExpect(jsonPath("$.description", equalTo(category.getDescription())))
        	.andExpect(jsonPath("$.title", equalTo(category.getTitle())));
	}
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)
	public void insertCategoryMissingRequiredData() throws Exception {
		Category category = categories.get(0);
		
		Category clone = new Category();
		BeanUtils.copyProperties(category, clone);
		clone.setTitle(null);
		
		String payload = toJson(clone);
		
		System.out.println(payload);
		
		this.mockMvc.perform(post(ENDPOINT).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
			/*.andDo(print())*/
        	.andExpect(status().isBadRequest())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.description", equalTo("Payload is not valid")))
        	.andExpect(jsonPath("$.errors[0]", equalTo("The title must be specified")));
	}	
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)
	public void updateCategory() throws Exception {
		Category category = categories.get(0);
		String id = category.getId();
		String payload = toJson(category);
		
		given(categoryRepository.findById(id)).willReturn(Optional.of(category));
		given(categoryRepository.save(category)).willReturn(category);
		
		this.mockMvc.perform(put(ENDPOINT_BY_ID, id).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
			/*.andDo(print())*/
        	.andExpect(status().isOk())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.id", equalTo(category.getId())))
        	.andExpect(jsonPath("$.description", equalTo(category.getDescription())))
        	.andExpect(jsonPath("$.title", equalTo(category.getTitle())));
	}
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)
	public void updateCategoryMissingRequiredData() throws Exception {
		Category category = categories.get(0);
		String id = category.getId();
		
		Category clone = new Category();
		BeanUtils.copyProperties(category, clone);
		clone.setTitle(null);
		
		String payload = toJson(clone);
		
		this.mockMvc.perform(put(ENDPOINT_BY_ID, id).contentType(MediaType.APPLICATION_JSON_UTF8).content(payload))
			/*.andDo(print())*/
        	.andExpect(status().isBadRequest())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        	.andExpect(jsonPath("$.description", equalTo("Payload is not valid")))
        	.andExpect(jsonPath("$.errors[0]", equalTo("The title must be specified")));
	}	
	
	@Test
	@WithMockUser(username = USER, roles = ADMIN_ROLE)
	public void deleteRootCategory() throws Exception {
		Category category = roots.get(0);
		String id = category.getId();
		
		List<Category> children = categories.stream().filter(c -> c.getParentId() != null && c.getParentId() == id).collect(Collectors.toList());
		
		given(categoryRepository.findById(id)).willReturn(Optional.of(category));
		given(categoryRepository.findByParentId( new ObjectId( id ) )).willReturn(children);
		given(categoryRepository.saveAll(children)).willReturn(children);
		willDoNothing().given(categoryRepository).delete(category);
		
		this.mockMvc.perform(delete(ENDPOINT_BY_ID, id))
//			.andDo(MockMvcResultHandlers.print())
        	.andExpect(status().isOk());
	}
	
	@Test
	@WithMockUser(username = USER, roles = ADMIN_ROLE)
	public void deleteSingleCategory() throws Exception {
		Category category = categories.get(0);
		String id = category.getId();
		
		given(categoryRepository.findById(id)).willReturn(Optional.of(category));
		given(categoryRepository.findByParentId( new ObjectId( category.getId() ) )).willReturn(Collections.<Category>emptyList());
		willDoNothing().given(categoryRepository).delete(category);
		
		this.mockMvc.perform(delete(ENDPOINT_BY_ID, id))
//			.andDo(MockMvcResultHandlers.print())
        	.andExpect(status().isOk());
	}
	
	@Test
	@WithMockUser(username = USER, roles = ADMIN_ROLE)
	public void deleteCategoryNotFound() throws Exception {
		Category category = categories.get(0);
		String id = category.getId();
		
		given(categoryRepository.findById(id)).willReturn(Optional.empty());
		
		this.mockMvc.perform(delete(ENDPOINT_BY_ID, id))
			/*.andDo(print())*/
        	.andExpect(status().isNotFound())
        	.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
	}	
}