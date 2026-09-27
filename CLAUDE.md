# CLAUDE.md

Mr. Hussle is a personal daily task tracker. Tasks earn "coins" when completed, and progress/rewards are tracked on top of that. It is a work in progress.

## Repository layout

Monorepo with two independent apps:

```
mr-hussle-frontend/   Angular 22 SPA (SSR enabled), Angular Material 22, Vitest
mr-hussle-backend/    Spring Boot 4 REST API, Java 17, Maven, JPA + PostgreSQL, Lombok
```

### Frontend (`mr-hussle-frontend/src/app`)

```
app.ts / app.html        Root component (just a <router-outlet>)
app.config.ts            Providers: router, hydration, HttpClient (withFetch)
app.config.server.ts     SSR providers
app.routes.ts            '' -> 'home', 'home' -> HomeScreen, 'tasks/:id' -> TaskDetails
components/
  home-screen/           Page shell, hosts TaskList
  task-list/             Lists tasks, toggles completion, inline edit via Signal Forms
  task-details/          Stub, not implemented yet
services/task.service.ts HttpClient wrapper for /api/tasks (returns Observables)
models/task.model.ts     Task interface { id, title, value, dueDate, priority, category, completionStatus }
enums/task-status.enum.ts COMPLETED | IN_PROGRESS | FAILED
enums/task-category.enum.ts ONE_TIME
utils/iso-date.ts        Date <-> 'yyyy-MM-dd' conversion (local time) for the datepicker
```

- Each component lives in its own folder as `name.ts`, `name.html`, `name.css`, `name.spec.ts` (no `.component` suffix; class name has no `Component` suffix, e.g. `TaskList`).
- Global styles: `src/material-theme.scss` (Material 3 theme via `mat.theme()`, rose/red palettes) and `src/styles.css`.
- Prettier config lives in `package.json` (printWidth 100, single quotes).

### Backend (`mr-hussle-backend/src/main/java/com/app/mrhusslebackend`)

```
controller/TaskController.java   REST endpoints under /api/tasks (CORS allows localhost:4200)
model/entities/Task.java         JPA entity (table "tasks", UUID id)
model/enums/                     TaskStatus, TaskCategory (same values as the frontend enums)
repository/TaskRepository.java   Spring Data JPA repository
```

- Runs on port **2121**; PostgreSQL at `localhost:5432/mr_hussle_db` (`application.properties`), `ddl-auto=update`.
- A task's `value` is called **Coins** in the UI; in code (and JSON) it is always `value`. The DB column is still named `coins`.
- Request bodies are validated with Bean Validation (`@Valid` + constraints on the `Task` entity; invalid data -> 400 problem-detail JSON). Keep backend constraints in sync with the Signal Forms validators in `task-list.ts`.
- Creating a task (POST) always sets `completionStatus = IN_PROGRESS`; `category` defaults to `ONE_TIME`.
- Frontend and backend models must stay in sync (Task fields, TaskStatus values). `dueDate` is a `LocalDate` in Java and an ISO `'yyyy-MM-dd'` string in the frontend.

## Commands

Frontend (run in `mr-hussle-frontend/`):
- `npm start` – dev server on http://localhost:4200
- `npm run build` – production build
- `npm test` – unit tests (Vitest via `@angular/build:unit-test`)

Backend (run in `mr-hussle-backend/`):
- `./mvnw spring-boot:run` – start API (needs local PostgreSQL)
- `./mvnw test`

## Coding conventions

### Always use the most modern approach
Use the current, recommended APIs of Angular 22, Angular Material 22, Spring Boot 4 and Java. Do not introduce legacy patterns, and migrate old ones when touching that code.

### Angular: signals wherever they are useful
- State in components: `signal()`, derived state: `computed()`, side effects: `effect()` / `linkedSignal()` as appropriate.
- Async data into components: `resource()` / `rxResource()` / `httpResource()` instead of `ngOnInit` + `subscribe`.
- Forms: **Signal Forms** (`form()`, `[formField]` from `@angular/forms/signals`), not Reactive/Template-driven forms.
- Component APIs: `input()`, `output()`, `model()`, `viewChild()` / `contentChild()` – not decorators (`@Input`, `@Output`, `@ViewChild`).
- Services stay Observable-based for HTTP; components convert results to signals.

### Angular: other modern defaults
- Standalone components only (no NgModules, no explicit `standalone: true` needed).
- `inject()` instead of constructor injection.
- Built-in control flow (`@if`, `@for` with `track`, `@switch`, `@defer`), not `*ngIf` / `*ngFor`.
- Zoneless + OnPush (Angular 22 default) – don't add `changeDetection` or zone-dependent code.
- Functional router guards/resolvers, `provide*()` functions in `app.config.ts`.
- Keep SSR compatibility in mind (no direct `window`/`document` access outside `afterNextRender` or platform checks).

### UI: Angular Material
- Use Angular Material (and CDK) components for all UI elements – buttons, inputs, lists, dialogs, etc. Avoid hand-rolled or third-party UI components when Material has one.
- Icons: **Material Symbols Outlined** (set as the default font set for `<mat-icon>` in `app.config.ts`), not the legacy Material Icons font.
- App-specific colors with no Material role are CSS variables in `material-theme.scss` (`--app-priority-color`, `--app-value-color`).
- Use the Material 3 APIs (e.g. `matButton="filled"`, `matIconButton`) and style with `--mat-sys-*` system variables / theme tokens rather than hard-coded colors.

### Comments
The existing code contains explanatory comments about signals, resources and Signal Forms – the author is learning these concepts. Keep such comments when editing and add brief explanations for new modern Angular concepts.
