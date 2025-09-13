import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieBooksComponent } from './categorie-books.component';

describe('CategorieBooksComponent', () => {
  let component: CategorieBooksComponent;
  let fixture: ComponentFixture<CategorieBooksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategorieBooksComponent]
    });
    fixture = TestBed.createComponent(CategorieBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
