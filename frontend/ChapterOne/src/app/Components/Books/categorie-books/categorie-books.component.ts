import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { BookCategorie } from 'src/app/models/BookCategorie';
import { Language } from 'src/app/models/Language';
import { ThemeService } from 'src/app/Services/theme.service';

@Component({
  selector: 'app-categorie-books',
  templateUrl: './categorie-books.component.html',
  styleUrls: ['./categorie-books.component.css']
})
export class CategorieBooksComponent implements OnInit {
  theme: string = 'light';
  page: number = 1;
  itemsPerPage: number = 8;
  filteredCategories: BookCategorie[] = [];
  searchTerm: string = '';
  selectedCategorie: BookCategorie | null = null;
  updateCategorieForm!: FormGroup;
  createCategorieForm!: FormGroup;

  constructor(private themeService: ThemeService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.themeService.theme$.subscribe(t => {
      this.theme = t;
    });
    this.filteredCategories = this.allCategories;
    this.initializeCreateCategorieForm();
    this.initializeUpdateCategorieForm();
  }

  //  ********************************************************************** Searching **********************************************************************
  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredCategories = this.allCategories.filter(categorie =>
      categorie.name.toLowerCase().includes(term) ||
      categorie.number.toString().includes(term)
    );
    this.page = 1;
  }

  //  ********************************************************************** consulting **********************************************************************
  openConsultModal(categorie: BookCategorie): void {
    this.selectedCategorie = categorie;
    const consultModalElement = document.getElementById('consultModal');
    if (consultModalElement) {
      const consultModal = new bootstrap.Modal(consultModalElement);
      consultModal.show();
    }
  }
  closeConsultModal(): void {
    const consultModalElement = document.getElementById('consultModal');
    if (consultModalElement) {
      const consultModal = bootstrap.Modal.getInstance(consultModalElement);
      consultModal?.hide();
    }
  }

  //  ********************************************************************** Create Categorie **********************************************************************
  initializeCreateCategorieForm(): void {
    this.createCategorieForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ0-9\\s]+$')]],
      color: ['', [Validators.required, Validators.pattern('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')]],
      number: ['', [Validators.required, Validators.pattern('^[0-9]{1,3}$')]]
    });
  }
  openCreateCategorieModal(): void {
    const consultModalElement = document.getElementById('createCategorieModal');
    if (consultModalElement) {
      const consultModal = new bootstrap.Modal(consultModalElement);
      consultModal.show();
    }
  }
  closeCreateCategorieModal(): void {
    const consultModalElement = document.getElementById('createCategorieModal');
    if (consultModalElement) {
      const consultModal = bootstrap.Modal.getInstance(consultModalElement);
      consultModal?.hide();
    }
  }
  createCategorie() {
    if (this.createCategorieForm.valid) {
      console.log("✅ Categorie created:", this.createCategorieForm.value);
      this.closeCreateCategorieModal();
      this.createCategorieForm.reset()
    }
  }
  //  ********************************************************************** Update Categorie **********************************************************************
  isFormValid(): boolean {
    return this.updateCategorieForm.valid && this.updateCategorieForm.dirty;
  }
  initializeUpdateCategorieForm(): void {
    this.updateCategorieForm = this.formBuilder.group({
      name: ['', [Validators.pattern('^[a-zA-ZÀ-ÿ0-9\\s]+$')]],
      color: ['', [Validators.pattern('^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$')]],
      number: ['', [Validators.pattern('^[0-9]{1,4}$')]],
      numberOfBooksInCategorie: ['', [Validators.pattern('^[0-9]{1,3}$')]],
    });
  }
  openUpdateModal(categorie: BookCategorie): void {
    this.selectedCategorie = categorie;
    console.log(this.selectedCategorie)
    this.updateCategorieForm.patchValue(categorie);
    const consultModalElement = document.getElementById('updateCategorieModal');
    if (consultModalElement) {
      const consultModal = new bootstrap.Modal(consultModalElement);
      consultModal.show();
    }
  }
  closeUpdateModal(): void {
    const consultModalElement = document.getElementById('updateCategorieModal');
    if (consultModalElement) {
      const consultModal = bootstrap.Modal.getInstance(consultModalElement);
      consultModal?.hide();
    }
  }
  updateCategorie() {
    console.log("✅ Categorie updated:", this.updateCategorieForm.value);
    this.closeUpdateModal();
    this.updateCategorieForm.reset()
  }

  //  ********************************************************************** pagination **********************************************************************
  get paginatedCategorie(): BookCategorie[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCategories.slice(startIndex, endIndex);
  }
  get totalPages(): number {
    return Math.ceil(this.filteredCategories.length / this.itemsPerPage);
  }
  get isPreviousPageDisabled(): boolean {
    return this.page === 1;
  }
  get isNextPageDisabled(): boolean {
    return this.page === this.totalPages;
  }
  goToNextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }
  goToPreviousPage(): void {
    if (this.page > 1) {
      this.page--;
    }
  }

  allCategories: BookCategorie[] = [
    { idBookCategorie: '1', name: 'Fiction', color: '#3c5f6d', number: 101, numberOfBooksInCategorie: 3 },
    { idBookCategorie: '2', name: 'Science', color: '#d13a58', number: 102, numberOfBooksInCategorie: 3 },
    { idBookCategorie: '3', name: 'History', color: '#7429d0ff', number: 103, numberOfBooksInCategorie: 3 }
  ];
}
