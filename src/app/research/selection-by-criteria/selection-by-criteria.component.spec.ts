import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionByCriteriaComponent } from './selection-by-criteria.component';

describe('SelectionByCriteriaComponent', () => {
  let component: SelectionByCriteriaComponent;
  let fixture: ComponentFixture<SelectionByCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionByCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionByCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
