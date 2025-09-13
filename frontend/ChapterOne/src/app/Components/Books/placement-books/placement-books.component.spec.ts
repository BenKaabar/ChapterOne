import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementBooksComponent } from './placement-books.component';

describe('PlacementBooksComponent', () => {
  let component: PlacementBooksComponent;
  let fixture: ComponentFixture<PlacementBooksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlacementBooksComponent]
    });
    fixture = TestBed.createComponent(PlacementBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
