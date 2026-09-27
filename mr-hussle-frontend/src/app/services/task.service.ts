import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskStatus } from '../enums/task-status.enum';
import { Task } from '../models/task.model';

const baseUrl = 'http://localhost:2121/api/tasks';

// The service stays Observable-based on purpose: an HTTP request is a one-off *event*,
// which is what Observables model well. Components turn the results into signals
// (see `rxResource` in TaskList), because signals model *state* that the UI reads.
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http = inject(HttpClient);

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(baseUrl);
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${baseUrl}/${id}`);
  }

  createTask(data: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(baseUrl, data);
  }

  updateTask(id: string, data: Task): Observable<Task> {
    return this.http.put<Task>(`${baseUrl}/${id}`, data);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAllTasks(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findTaskByCompletionStatus(completionStatus: TaskStatus): Observable<Task[]> {
    return this.http.get<Task[]>(`${baseUrl}/status/${completionStatus}`);
  }
}
