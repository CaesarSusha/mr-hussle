import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TaskStatus } from '../../enums/task-status.enum';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import { of } from 'rxjs';

@Component({
  selector: 'app-task-list',
  imports: [MatSlideToggleModule, MatListModule, MatCheckboxModule],
  templateUrl: './task-list.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './task-list.css',
})
export class TaskList implements OnInit {
  readonly TaskStatus = TaskStatus;
  public tasks: Task[] = [];

  constructor(private taskService: TaskService) {}
  ngOnInit() {
    this.taskService
      .getAllTasks()
      .pipe(
        map((data) => data),
        catchError((err) => {
          console.error(err);
          return of([]);
        }),
      )
      .subscribe((data) => {
        this.tasks = data;
      });
  }

  public toggleTaskCompletion(task: Task, isCompleted: boolean) {
    console.log(`Task ${task.id} completion status changed to: ${isCompleted}`);
    this.taskService
      .updateTask(task.id, {
        ...task,
        completionStatus: isCompleted ? TaskStatus.COMPLETED : TaskStatus.IN_PROGRESS,
      })
      .subscribe(() => {
        this.loadTasks();
      });
  }

  public loadTasks() {
    this.taskService.getAllTasks().subscribe((data) => {
      this.tasks = data;
    });
  }

  //Idee: Es gibt einen "End Day" Button, der alle Tasks auf "FAILED" setzt, die aktuell "IN_PROGRESS" sind.
  //That way I will not need to implement any extra logic for failing a daily task.
  //I will probably need a function to delay a task tho
}
