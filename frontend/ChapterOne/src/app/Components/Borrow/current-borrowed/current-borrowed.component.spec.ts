import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentBorrowedComponent } from './current-borrowed.component';

describe('CurrentBorrowedComponent', () => {
  let component: CurrentBorrowedComponent;
  let fixture: ComponentFixture<CurrentBorrowedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrentBorrowedComponent]
    });
    fixture = TestBed.createComponent(CurrentBorrowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
