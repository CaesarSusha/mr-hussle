import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskList } from '../task-list/task-list';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [TaskList, MatButtonModule, MatIconModule],
  templateUrl: './home-screen.html',
  styleUrl: './home-screen.css',
})
export class HomeScreen {}
