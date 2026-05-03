package com.app.mrhusslebackend.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.mrhusslebackend.model.entities.Task;
import com.app.mrhusslebackend.model.enums.TaskStatus;
import com.app.mrhusslebackend.repository.TaskRepository;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class TaskController {
	@Autowired
	TaskRepository taskRepository;

	@GetMapping("/tasks")
	public ResponseEntity<List<Task>> getAllTasks(@RequestParam(required = false) String title) {
		List<Task> tasks = (title == null) ? taskRepository.findAll() : taskRepository.findByTitleContaining(title);
		return ResponseEntity.ok(tasks);
	}

	@GetMapping("/tasks/{id}")
	public ResponseEntity<Task> getTaskById(@PathVariable() UUID id) {
		Optional<Task> task = taskRepository.findById(id);
		if (task.isPresent()) {
			return ResponseEntity.ok(task.get());
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@PostMapping("/tasks")
	public ResponseEntity<Task> createTask(@RequestBody Task task) {
		taskRepository.save(task);
		return ResponseEntity.status(HttpStatus.CREATED).body(task);
	}

	@PutMapping("/tasks/{id}")
	public ResponseEntity<Task> updateTask(@PathVariable() UUID id, @RequestBody Task task) {
		Optional<Task> existingTask = taskRepository.findById(id);
		if (existingTask.isPresent()) {
			Task updatedTask = existingTask.get();
			updatedTask.setTitle(task.getTitle());
			updatedTask.setCoins(task.getCoins());
			updatedTask.setCompletionStatus(task.getCompletionStatus());
			taskRepository.save(updatedTask);
			return ResponseEntity.ok(updatedTask);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@DeleteMapping("/tasks/{id}")
	public ResponseEntity<HttpStatus> deleteTask(@PathVariable() UUID id) {
		Optional<Task> existingTask = taskRepository.findById(id);
		if (existingTask.isPresent()) {
			taskRepository.deleteById(id);
			return ResponseEntity.noContent().build();
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@DeleteMapping("/tasks")
	public ResponseEntity<HttpStatus> deleteAllTasks() {
		taskRepository.deleteAll();
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/tasks/status/{completionStatus}")
	public ResponseEntity<List<Task>> findByCompletionStatus(
			@PathVariable() TaskStatus completionStatus) {
		List<Task> tasks = taskRepository.findByCompletionStatus(completionStatus);
		return ResponseEntity.ok(tasks);
	}
}
