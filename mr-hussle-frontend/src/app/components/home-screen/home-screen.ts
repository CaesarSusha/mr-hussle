import { Component, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskList } from '../task-list/task-list';

@Component({
  selector: 'app-home-screen',
  imports: [TaskList, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './home-screen.html',
  styleUrl: './home-screen.css',
})
export class HomeScreen {
  // `viewChild` is the signal-based version of `@ViewChild`: it returns a signal that holds
  // the TaskList instance from this template. `.required` means it always exists, so no null check.
  readonly taskList = viewChild.required(TaskList);
}
