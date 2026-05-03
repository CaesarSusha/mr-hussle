import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Task } from '../models/task.model';

const baseUrl = 'http://localhost:8080/api/tasks';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(baseUrl);
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${baseUrl}/${id}`);
  }

  createTask(data: Task): Observable<Task> {
    return this.http.post<Task>(baseUrl, data);
  }

  updateTask(id: string, data: Task): Observable<Task> {
    console.log('updateTask in FE service');
    return this.http.put<Task>(`${baseUrl}/${id}`, data);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAllTasks(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findTaskByCompletionStatus(completionStatus: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${baseUrl}?completionStatus=${completionStatus}`);
  }
}
