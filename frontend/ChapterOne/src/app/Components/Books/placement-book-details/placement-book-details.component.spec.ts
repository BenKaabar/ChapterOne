import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementBookDetailsComponent } from './placement-book-details.component';

describe('PlacementBookDetailsComponent', () => {
  let component: PlacementBookDetailsComponent;
  let fixture: ComponentFixture<PlacementBookDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlacementBookDetailsComponent]
    });
    fixture = TestBed.createComponent(PlacementBookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
