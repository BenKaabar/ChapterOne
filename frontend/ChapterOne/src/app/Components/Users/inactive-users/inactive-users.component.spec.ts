import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveUsersComponent } from './inactive-users.component';

describe('InactiveUsersComponent', () => {
  let component: InactiveUsersComponent;
  let fixture: ComponentFixture<InactiveUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InactiveUsersComponent]
    });
    fixture = TestBed.createComponent(InactiveUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
