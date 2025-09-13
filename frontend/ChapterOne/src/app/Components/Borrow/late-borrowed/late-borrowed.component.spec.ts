import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LateBorrowedComponent } from './late-borrowed.component';

describe('LateBorrowedComponent', () => {
  let component: LateBorrowedComponent;
  let fixture: ComponentFixture<LateBorrowedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LateBorrowedComponent]
    });
    fixture = TestBed.createComponent(LateBorrowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
