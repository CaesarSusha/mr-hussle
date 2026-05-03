package com.app.mrhusslebackend.model.entities;

import java.util.UUID;

import com.app.mrhusslebackend.model.enums.TaskStatus;

// import javax.persistence.*; // for Spring Boot 2
// for Spring Boot 3
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tasks")
public class Task {

    @Getter
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID id;

    @Getter
    @Setter
    @Column(name = "title")
    private String title;

    @Getter
    @Setter
    @Column(name = "coins")
    private Integer coins;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    @Column(name = "completion_status")
    private TaskStatus completionStatus = TaskStatus.IN_PROGRESS;
}