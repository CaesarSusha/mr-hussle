import { TaskCategory } from '../enums/task-category.enum';
import { TaskStatus } from '../enums/task-status.enum';

export interface Task {
  id: string;
  title: string;
  /** Shown as "Coins" in the UI. */
  value: number;
  /** ISO date 'yyyy-MM-dd' (backend `LocalDate`). */
  dueDate: string;
  priority: number;
  category: TaskCategory;
  completionStatus: TaskStatus;
}
