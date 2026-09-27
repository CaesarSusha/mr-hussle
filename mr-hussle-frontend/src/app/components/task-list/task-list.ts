import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { form, FormField, maxLength, min, required, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TaskCategory } from '../../enums/task-category.enum';
import { TaskStatus } from '../../enums/task-status.enum';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { fromIsoDate, toIsoDate, today } from '../../utils/iso-date';

// The datepicker works with `Date` objects, so the form holds a `Date` (or null while the input
// is empty/invalid). It is converted to the backend's 'yyyy-MM-dd' string when saving.
type TaskFormModel = Pick<Task, 'title' | 'value' | 'priority'> & { dueDate: Date | null };

const DEFAULT_PRIORITY = 3;
const DEFAULT_VALUE = 1;

// Signal Forms validator: returning an error object marks the field invalid, `undefined` = valid.
const wholeNumber = ({ value }: { value: () => number }) =>
  Number.isInteger(value()) ? undefined : { kind: 'wholeNumber', message: 'Must be a whole number' };

// What the list is editing right now: a draft for a new task, or an existing task.
// A union type like this makes invalid states (e.g. "creating AND editing") impossible.
type EditState = { mode: 'create' } | { mode: 'edit'; task: Task };

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
    MatDatepickerModule,
    MatTooltipModule,
    FormField,
    NgTemplateOutlet,
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
  // Read it by calling it: `editState()`. Change it with `.set(v)` or `.update(fn)`.
  // Anything that read it (template, computed, effect) is notified when it changes.
  readonly editState = signal<EditState | null>(null);

  // `computed` derives a read-only signal from other signals. Angular records which signals
  // were read inside the function (here: `editState`) and recomputes only when one of them
  // changes. The result is cached (memoized), so reading it many times is cheap.
  readonly isEditing = computed(() => this.editState() !== null);
  readonly isCreating = computed(() => this.editState()?.mode === 'create');
  readonly editingTaskId = computed(() => {
    const state = this.editState();
    return state?.mode === 'edit' ? state.task.id : null;
  });

  // Signal Forms: the form's data lives in a plain writable signal (the "model")...
  readonly taskModel = signal<TaskFormModel>(newTaskDefaults());

  // ...and `form()` builds a FieldTree on top of it. The field tree mirrors the model's shape
  // (`taskForm.title`, `taskForm.value`). Calling a field gives its state as signals, e.g.
  // `taskForm.title().value()`, `.errors()`, `.touched()`, and `taskForm().invalid()` for
  // the whole form. Typing in an input writes straight into `taskModel`, and vice versa.
  // The second argument is a *schema function*: validation rules are declared per path.
  readonly taskForm = form(this.taskModel, (task) => {
    required(task.title);
    maxLength(task.title, 50);
    required(task.dueDate);
    required(task.priority);
    validate(task.priority, wholeNumber);
    required(task.value);
    min(task.value, 0);
    validate(task.value, wholeNumber);
  });

  public toggleTaskCompletion(task: Task, isCompleted: boolean) {
    this.taskService
      .updateTask(task.id, {
        ...task,
        completionStatus: isCompleted ? TaskStatus.COMPLETED : TaskStatus.IN_PROGRESS,
      })
      .subscribe(() => this.tasks.reload());
  }

  // Opens an empty draft row. Nothing is sent to the backend until the user clicks Save,
  // so cancelling simply throws the draft away.
  public addTask() {
    this.taskModel.set(newTaskDefaults());
    this.editState.set({ mode: 'create' });
  }

  public editTask(task: Task) {
    // Tasks created before due date/priority existed have no value yet, so fall back to defaults.
    this.taskModel.set({
      title: task.title,
      dueDate: task.dueDate ? fromIsoDate(task.dueDate) : today(),
      priority: task.priority ?? DEFAULT_PRIORITY,
      value: task.value,
    });
    this.editState.set({ mode: 'edit', task });
  }

  public saveTask() {
    const state = this.editState();
    const { dueDate, ...values } = this.taskModel();
    if (!state || !dueDate || this.taskForm().invalid()) {
      return;
    }
    const formValues = { ...values, dueDate: toIsoDate(dueDate) };

    // Create: send only the form values; the backend generates the id.
    // Edit: merge the edited form values (read from the model signal) into the original task.
    const request =
      state.mode === 'create'
        ? this.taskService.createTask({
            ...formValues,
            category: TaskCategory.ONE_TIME,
            completionStatus: TaskStatus.IN_PROGRESS,
          })
        : this.taskService.updateTask(state.task.id, { ...state.task, ...formValues });

    request.subscribe(() => {
      this.editState.set(null);
      this.tasks.reload();
    });
  }

  public cancelEdit() {
    this.editState.set(null);
  }

  //Idee: Es gibt einen "End Day" Button, der alle Tasks auf "FAILED" setzt, die aktuell "IN_PROGRESS" sind.
  //That way I will not need to implement any extra logic for failing a daily task.
  //I will probably need a function to delay a task tho
}

function newTaskDefaults(): TaskFormModel {
  return { title: '', dueDate: today(), priority: DEFAULT_PRIORITY, value: DEFAULT_VALUE };
}
