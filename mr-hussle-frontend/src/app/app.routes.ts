import { Routes } from '@angular/router';
import { AddTask } from './components/add-task/add-task';
import { TaskDetails } from './components/task-details/task-details';
import { TaskList } from './components/task-list/task-list';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', component: TaskList },
  { path: 'tasks/:id', component: TaskDetails },
  { path: 'add', component: AddTask },
];
