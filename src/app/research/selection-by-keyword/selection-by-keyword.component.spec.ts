import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionByKeywordComponent } from './selection-by-keyword.component';

describe('SelectionByKeywordComponent', () => {
  let component: SelectionByKeywordComponent;
  let fixture: ComponentFixture<SelectionByKeywordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionByKeywordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionByKeywordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
