import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  imports: [FormsModule],
  templateUrl: './add-task.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './add-task.css',
})
export class AddTask {}
