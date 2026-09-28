import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

interface SidebarItem {
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [MatButtonModule, MatIconModule, MatListModule, MatTooltipModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  // `host` binds to the <app-sidebar> element itself: it gets the `collapsed` class whenever
  // the signal is true. The CSS uses that class to shrink the sidebar to icon width.
  host: { '[class.collapsed]': 'collapsed()' },
})
export class Sidebar {
  // Open (labels visible) by default; the toggle button flips it to icons-only.
  readonly collapsed = signal(false);

  // The items don't do anything yet – they are placeholders for upcoming pages.
  protected readonly items: SidebarItem[] = [
    { label: 'Login', icon: 'login' },
    { label: 'Taskdump', icon: 'assignment_add' },
    { label: 'Pouch', icon: 'money_bag' },
    { label: 'Categories', icon: 'category' },
  ];

  toggle(): void {
    // `update()` sets a new value based on the current one.
    this.collapsed.update((collapsed) => !collapsed);
  }
}
