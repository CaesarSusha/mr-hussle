package com.app.mrhusslebackend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.app.mrhusslebackend.model.entities.Task;
import com.app.mrhusslebackend.repository.TaskRepository;

@WebMvcTest(TaskController.class)
class TaskControllerTests {

	private static final String VALID_TASK = """
			{"title": "Write tests", "dueDate": "2026-09-27", "priority": 3, "value": 1}
			""";

	@Autowired
	MockMvc mockMvc;

	@MockitoBean
	TaskRepository taskRepository;

	@Test
	void createTaskSavesAsInProgressOneTimeTask() throws Exception {
		when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

		mockMvc.perform(post("/api/tasks").contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"title": "Write tests", "dueDate": "2026-09-27", "priority": 99, "value": 1,
						 "completionStatus": "COMPLETED"}
						"""))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.title").value("Write tests"))
				.andExpect(jsonPath("$.dueDate").value("2026-09-27"))
				.andExpect(jsonPath("$.priority").value(99))
				.andExpect(jsonPath("$.value").value(1))
				.andExpect(jsonPath("$.category").value("ONE_TIME"))
				.andExpect(jsonPath("$.completionStatus").value("IN_PROGRESS"));
	}

	@Test
	void createTaskRejectsMissingFields() throws Exception {
		mockMvc.perform(post("/api/tasks").contentType(MediaType.APPLICATION_JSON).content("{}"))
				.andExpect(status().isBadRequest());

		verify(taskRepository, never()).save(any());
	}

	@Test
	void createTaskRejectsBlankTitle() throws Exception {
		mockMvc.perform(post("/api/tasks").contentType(MediaType.APPLICATION_JSON)
				.content(VALID_TASK.replace("Write tests", " ")))
				.andExpect(status().isBadRequest());
	}

	@Test
	void createTaskRejectsTooLongTitle() throws Exception {
		mockMvc.perform(post("/api/tasks").contentType(MediaType.APPLICATION_JSON)
				.content(VALID_TASK.replace("Write tests", "x".repeat(51))))
				.andExpect(status().isBadRequest());
	}

	@Test
	void createTaskRejectsNegativeValue() throws Exception {
		mockMvc.perform(post("/api/tasks").contentType(MediaType.APPLICATION_JSON)
				.content(VALID_TASK.replace("\"value\": 1", "\"value\": -1")))
				.andExpect(status().isBadRequest());
	}

	@Test
	void updateTaskRejectsMissingPriority() throws Exception {
		mockMvc.perform(put("/api/tasks/" + UUID.randomUUID()).contentType(MediaType.APPLICATION_JSON)
				.content(VALID_TASK.replace("\"priority\": 3", "\"priority\": null")))
				.andExpect(status().isBadRequest());

		verify(taskRepository, never()).save(any());
	}
}
