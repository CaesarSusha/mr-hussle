import { Routes } from '@angular/router';
import { TaskDetails } from './components/task-details/task-details';
// import { TaskList } from './components/task-list/task-list';
import { HomeScreen } from './components/home-screen/home-screen';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeScreen },
  { path: 'tasks/:id', component: TaskDetails },
];
