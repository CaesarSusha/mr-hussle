import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { form, FormField, maxLength, min, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TaskStatus } from '../../enums/task-status.enum';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

type TaskFormModel = Pick<Task, 'title' | 'coins'>;

// No `changeDetection` setting: Angular 22 defaults to OnPush, which only re-renders this
// component when something it depends on tells Angular it changed. Signals do exactly that.
// Every signal the template reads is tracked, and setting it marks this component for update.
// The old code needed `Eager` because it mutated a plain `tasks` array that Angular couldn't track.
@Component({
  selector: 'app-task-list',
  imports: [
    MatSlideToggleModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    FormField,
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  private readonly taskService = inject(TaskService);

  readonly TaskStatus = TaskStatus;

  // A resource turns async work into signals. `stream` runs once on creation (and again on
  // `reload()`), and the result is exposed as signals: `tasks.value()`, `tasks.isLoading()`,
  // `tasks.error()`. This replaces ngOnInit + subscribe + `this.tasks = data`, and the
  // subscription is cleaned up automatically when the component is destroyed.
  // `rxResource` is the variant for Observables (our service returns Observables).
  readonly tasks = rxResource({
    stream: () => this.taskService.getAllTasks(),
  });

  // `signal(initialValue)` creates a writable signal: a box holding a value.
  // Read it by calling it: `editingTask()`. Change it with `.set(v)` or `.update(fn)`.
  // Anything that read it (template, computed, effect) is notified when it changes.
  readonly editingTask = signal<Task | null>(null);

  // `computed` derives a read-only signal from other signals. Angular records which signals
  // were read inside the function (here: `editingTask`) and recomputes only when one of them
  // changes. The result is cached (memoized), so reading it many times is cheap.
  readonly isEditing = computed(() => this.editingTask() !== null);

  // Signal Forms: the form's data lives in a plain writable signal (the "model")...
  readonly taskModel = signal<TaskFormModel>({ title: '', coins: 0 });

  // ...and `form()` builds a FieldTree on top of it. The field tree mirrors the model's shape
  // (`taskForm.title`, `taskForm.coins`). Calling a field gives its state as signals, e.g.
  // `taskForm.title().value()`, `.errors()`, `.touched()`, and `taskForm().invalid()` for
  // the whole form. Typing in an input writes straight into `taskModel`, and vice versa.
  // The second argument is a *schema function*: validation rules are declared per path.
  readonly taskForm = form(this.taskModel, (task) => {
    required(task.title);
    maxLength(task.title, 50);
    required(task.coins);
    min(task.coins, 0);
  });

  public toggleTaskCompletion(task: Task, isCompleted: boolean) {
    this.taskService
      .updateTask(task.id, {
        ...task,
        completionStatus: isCompleted ? TaskStatus.COMPLETED : TaskStatus.IN_PROGRESS,
      })
      .subscribe(() => this.tasks.reload());
  }

  public editTask(task: Task) {
    this.taskModel.set({ title: task.title, coins: task.coins });
    this.editingTask.set(task);
  }

  public saveTask() {
    const task = this.editingTask();
    if (!task || this.taskForm().invalid()) {
      return;
    }

    // Merge the edited form values (read from the model signal) into the original task.
    this.taskService.updateTask(task.id, { ...task, ...this.taskModel() }).subscribe(() => {
      this.editingTask.set(null);
      this.tasks.reload();
    });
  }

  public cancelEdit() {
    this.editingTask.set(null);
  }

  //Idee: Es gibt einen "End Day" Button, der alle Tasks auf "FAILED" setzt, die aktuell "IN_PROGRESS" sind.
  //That way I will not need to implement any extra logic for failing a daily task.
  //I will probably need a function to delay a task tho
}
