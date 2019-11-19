package com.finance;

import static org.hamcrest.Matchers.equalTo;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.ResultActions;

import com.finance.domain.Category;
import com.finance.repository.CategoryRepository;

public class CategoryTest extends AbstractBaseEntityTest<Category, CategoryRepository>{

	private static final String ENDPOINT = "/api/categories";
	
	private static final String ENDPOINT_BY_ID = String.format("%s/{id}", ENDPOINT);

	private List<Category> roots = new ArrayList<Category>();
	private List<Category> categories = new ArrayList<Category>();

	@MockBean
	private CategoryRepository categoryRepository;

	@Before
	public void setUp() {
		super.setUp();
		
		String parentOne = generateId();
		String parentTwo = generateId();

		roots.add(new Category(parentOne, "Title 1", "Description 1", null));
		roots.add(new Category(parentTwo, "Title 2", "Description 2", null));
		
		categories.addAll(roots);
		categories.add(new Category(generateId(), "Title 3", "Description 3", null));
		
		categories.add(new Category(generateId(), "Title 4", "Description 4", parentOne));
		categories.add(new Category(generateId(), "Title 5", "Description 5", parentOne));
		
		categories.add(new Category(generateId(), "Title 6", "Description 6", parentTwo));
		categories.add(new Category(generateId(), "Title 7", "Description 7", parentTwo));
	}

	@Override
	protected List<Category> getEntities() {
		return categories;
	}

	@Override
	protected CategoryRepository getRepository() {
		return categoryRepository;
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
	protected void checkBody(ResultActions resultActions, Category entity) throws Exception {
		resultActions.andExpect(jsonPath("$.id", equalTo(entity.getId())))
    	.andExpect(jsonPath("$.description", equalTo(entity.getDescription())))
    	.andExpect(jsonPath("$.title", equalTo(entity.getTitle())));
		
	}

	@Override
	protected void removeRequiredData(Category entity) {
		entity.setTitle(null);		
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
        	.andExpect(status().isOk());
	}
	
	@Test
	@WithMockUser(username = USER, roles = USER_ROLE)
	public void deleteRootCategoryForbidden() throws Exception {
		Category category = roots.get(0);
		String id = category.getId();
		
		this.mockMvc.perform(delete(ENDPOINT_BY_ID, id))
        	.andExpect(status().isForbidden());
	}

	/**
	 * This method forces to delete a leaf category.
	 */
	@Override
	public void deleteEntity() throws Exception {
		Category category = categories.stream().filter(c -> c.getParentId() != null).findFirst().get();
		String id = category.getId();
		
		given(categoryRepository.findById(id)).willReturn(Optional.of(category));
		willDoNothing().given(categoryRepository).delete(category);
		
		this.mockMvc.perform(delete(ENDPOINT_BY_ID, id))
        	.andExpect(status().isOk());
	}
}