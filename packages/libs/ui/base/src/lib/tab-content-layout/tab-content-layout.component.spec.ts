import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabContentLayoutComponent } from './tab-content-layout.component';

describe('TabContentLayoutComponent', () => {
  let component: TabContentLayoutComponent;
  let fixture: ComponentFixture<TabContentLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabContentLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabContentLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
