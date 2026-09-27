package com.app.mrhusslebackend.model.entities;

import java.time.LocalDate;
import java.util.UUID;

import com.app.mrhusslebackend.model.enums.TaskCategory;
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
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
    @NotBlank
    @Size(max = 50)
    @Column(name = "title")
    private String title;

    @Getter
    @Setter
    // Shown as "Coins" in the UI. The column keeps its old name so existing data is preserved.
    @NotNull
    @Min(0)
    @Column(name = "coins")
    private Integer value;

    @Getter
    @Setter
    @NotNull
    @Column(name = "due_date")
    private LocalDate dueDate;

    @Getter
    @Setter
    @NotNull
    @Column(name = "priority")
    private Integer priority;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private TaskCategory category = TaskCategory.ONE_TIME;

    @Getter
    @Setter
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "completion_status")
    private TaskStatus completionStatus = TaskStatus.IN_PROGRESS;
}