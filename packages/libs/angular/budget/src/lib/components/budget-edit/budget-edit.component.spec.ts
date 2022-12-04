import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetEditComponent } from './budget-edit.component';

describe('BudgetEditComponent', () => {
  let component: BudgetEditComponent;
  let fixture: ComponentFixture<BudgetEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
