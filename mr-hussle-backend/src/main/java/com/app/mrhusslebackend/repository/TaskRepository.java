package com.app.mrhusslebackend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.mrhusslebackend.model.entities.Task;
import com.app.mrhusslebackend.model.enums.TaskStatus;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByCoins(Integer coins);

    List<Task> findByTitleContaining(String title);

    List<Task> findByCompletionStatus(TaskStatus completionStatus);

}

/*
 * ============
 * INFO FOR ME
 * ============
 * 
 * I can now use the following methods without explicitly defining them:
 * save()
 * findOne()
 * findById()
 * findAll()
 * count()
 * delete()
 * deleteById()
 */
