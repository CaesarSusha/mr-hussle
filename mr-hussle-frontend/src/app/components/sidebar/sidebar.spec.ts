import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should be expanded by default and show all item labels', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(component.collapsed()).toBe(false);
    const labels = [...element.querySelectorAll('[matListItemTitle]')].map((el) =>
      el.textContent?.trim(),
    );
    expect(labels).toEqual(['Login', 'Taskdump', 'Pouch', 'Categories']);
  });

  it('should toggle the collapsed class that shrinks it to icon width', async () => {
    const element: HTMLElement = fixture.nativeElement;
    const toggle = element.querySelector<HTMLButtonElement>('.toggle')!;

    toggle.click();
    await fixture.whenStable();
    expect(component.collapsed()).toBe(true);
    expect(element.classList).toContain('collapsed');

    toggle.click();
    await fixture.whenStable();
    expect(component.collapsed()).toBe(false);
    expect(element.classList).not.toContain('collapsed');
  });
});
