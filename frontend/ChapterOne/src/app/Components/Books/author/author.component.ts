import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { Author } from 'src/app/models/Author';
import { ThemeService } from 'src/app/Services/theme.service';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {
  theme: string = 'light';
  page: number = 1;
  itemsPerPage: number = 8;
  filteredAuthors: Author[] = [];
  searchTerm: string = '';
  selectedAuthor: Author | null = null;
  updateAuthorForm!: FormGroup;
  createAuthorForm!: FormGroup;

  constructor(private themeService: ThemeService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.themeService.theme$.subscribe(t => {
      this.theme = t;
    });
    this.filteredAuthors = this.allAuthors;
    this.initializeCreateAuthorForm();
    this.initializeUpdateAuthorForm();
  }

  //  ********************************************************************** Searching **********************************************************************
  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredAuthors = this.allAuthors.filter(author =>
      author.authorName.toLowerCase().includes(term)
    );
    this.page = 1;
  }

  //  ********************************************************************** consulting **********************************************************************
  openConsultModal(author: Author): void {
    this.selectedAuthor = author;
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

  //  ********************************************************************** Create Book **********************************************************************
  initializeCreateAuthorForm(): void {
    this.createAuthorForm = this.formBuilder.group({
      authorName: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ0-9\\s]+$')]]
    });
  }
  openCreateAuthorModal(): void {
    const consultModalElement = document.getElementById('createAuthorModal');
    if (consultModalElement) {
      const consultModal = new bootstrap.Modal(consultModalElement);
      consultModal.show();
    }
  }
  closeCreateAuthorModal(): void {
    const consultModalElement = document.getElementById('createAuthorModal');
    if (consultModalElement) {
      const consultModal = bootstrap.Modal.getInstance(consultModalElement);
      consultModal?.hide();
    }
  }
  createAuthor() {
    if (this.createAuthorForm.valid) {
      console.log("✅ Author created:", this.createAuthorForm.value);
      this.closeCreateAuthorModal();
      this.createAuthorForm.reset()
    }
  }

  //  ********************************************************************** Update Author **********************************************************************
  isFormValid(): boolean {
    return this.updateAuthorForm.valid && this.updateAuthorForm.dirty;
  }
  initializeUpdateAuthorForm(): void {
    this.updateAuthorForm = this.formBuilder.group({
      authorName: ['', [Validators.pattern('^[a-zA-ZÀ-ÿ0-9\\s]+$')]],
      bookHave: ['', [Validators.pattern('^[0-9]{1,4}$')]]
    });
  }
  openUpdateModal(author: Author): void {
    this.selectedAuthor = author;
    this.updateAuthorForm.patchValue(author);
    const consultModalElement = document.getElementById('updateAuthorModal');
    if (consultModalElement) {
      const consultModal = new bootstrap.Modal(consultModalElement);
      consultModal.show();
    }
  }
  closeUpdateModal(): void {
    const consultModalElement = document.getElementById('updateAuthorModal');
    if (consultModalElement) {
      const consultModal = bootstrap.Modal.getInstance(consultModalElement);
      consultModal?.hide();
    }
  }
  updateAuthor() {
    console.log("✅ Author updated:", this.updateAuthorForm.value);
    this.closeUpdateModal();
    this.updateAuthorForm.reset()
  }

  //  ********************************************************************** Deleting Author **********************************************************************
  openDeleteModal(author: Author): void {
    this.selectedAuthor = author;
    const consultModalElement = document.getElementById('deleteModal');
    if (consultModalElement) {
      const consultModal = new bootstrap.Modal(consultModalElement);
      consultModal.show();
    }
  }
  closeDeleteModal(): void {
    const consultModalElement = document.getElementById('deleteModal');
    if (consultModalElement) {
      const consultModal = bootstrap.Modal.getInstance(consultModalElement);
      consultModal?.hide();
    }
  }
  DeleteAuthor(idAuthor: string) {
    console.log(JSON.stringify(idAuthor))
  }
  
  //  ********************************************************************** pagination **********************************************************************
  get paginatedAuthor(): Author[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredAuthors.slice(startIndex, endIndex);
  }
  get totalPages(): number {
    return Math.ceil(this.filteredAuthors.length / this.itemsPerPage);
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

  allAuthors = [
    { idAuthor: "1", authorName: "William Shakespeare", bookHave: 38 },
    { idAuthor: "2", authorName: "Jane Austen", bookHave: 6 },
    { idAuthor: "3", authorName: "Mark Twain", bookHave: 28 },
    { idAuthor: "4", authorName: "Charles Dickens", bookHave: 20 },
    { idAuthor: "5", authorName: "J.K. Rowling", bookHave: 15 },
    { idAuthor: "6", authorName: "George Orwell", bookHave: 9 },
    { idAuthor: "7", authorName: "Ernest Hemingway", bookHave: 7 },
    { idAuthor: "8", authorName: "Leo Tolstoy", bookHave: 12 },
    { idAuthor: "9", authorName: "Agatha Christie", bookHave: 66 },
    { idAuthor: "10", authorName: "Gabriel García Márquez", bookHave: 10 }
  ]
}
