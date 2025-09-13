import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { Author } from 'src/app/models/Author';
import { Book } from 'src/app/models/Book';
import { BookCategorie } from 'src/app/models/BookCategorie';
import { BookStatus } from 'src/app/models/BookStatus';
import { Language } from 'src/app/models/Language';
import { ThemeService } from 'src/app/Services/theme.service';

@Component({
  selector: 'app-available-books',
  templateUrl: './available-books.component.html',
  styleUrls: ['./available-books.component.css']
})
export class AvailableBooksComponent implements OnInit {
  theme: string = 'light';
  page: number = 1;
  itemsPerPage: number = 8;
  filteredBooks: Book[] = [];
  searchTerm: string = '';
  selectedBook: Book | null = null;
  BookStatus = BookStatus;
  updateBookForm!: FormGroup;
  createBookForm!: FormGroup;
  bookStatus = BookStatus;
  allAuthors: Author[] = [
    { idAuthor: '1', authorName: 'Harper Lee', bookHave: 5 },
    { idAuthor: '2', authorName: 'George Orwell', bookHave: 5 },
    { idAuthor: '3', authorName: 'J.K. Rowling', bookHave: 5 }
  ];

  allCategories: BookCategorie[] = [
    { idBookCategorie: '1', name: 'Fiction', color: 'blue', number: 101, numberOfBooksInCategorie: 3 },
    { idBookCategorie: '2', name: 'Science', color: 'green', number: 102, numberOfBooksInCategorie: 3 },
    { idBookCategorie: '3', name: 'History', color: 'red', number: 103, numberOfBooksInCategorie: 3 }
  ];

  allLanguages = Object.values(Language);
  constructor(private themeService: ThemeService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.themeService.theme$.subscribe(t => {
      this.theme = t;
    });
    this.filteredBooks = this.allBooks;
    this.initializeCreateBookForm();
    this.initializeUpdateBookForm();
  }

  //  ********************************************************************** Searching **********************************************************************
  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredBooks = this.allBooks.filter(book =>
      book.name.toLowerCase().includes(term) ||
      book.bookPlacement.toLowerCase().includes(term) ||
      book.primaryAuthor.authorName.toLowerCase().includes(term) ||
      book.categorie.name.toLowerCase().includes(term) ||
      (book.language?.toLowerCase().includes(term) ?? false)
    );
    this.page = 1;
  }

  //  ********************************************************************** consulting **********************************************************************
  openConsultModal(book: Book): void {
    this.selectedBook = book;
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
  initializeCreateBookForm(): void {
    this.createBookForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ0-9\\s]+$')]],
      description: ['', [Validators.pattern('^[a-zA-ZÀ-ÿ0-9\\s]+$')]],
      ISBN: ['', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
      publisher: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ0-9\\s]+$')]],
      bookPlacement: ['', [Validators.pattern('^[a-zA-ZÀ-ÿ0-9\\s]+$')]],
      pages: ['', [Validators.required, Validators.pattern('^[0-9]{1,4}$')]],
      primaryAuthor: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]],
      secondaryAuthor: ['', [Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]],
      publishedDate: ['', Validators.required],
      status: ['', Validators.required],
      language: ['', Validators.required],
      categorie: ['', Validators.required]
    });
  }
  openCreateBookModal(): void {
    const consultModalElement = document.getElementById('createBookModal');
    if (consultModalElement) {
      const consultModal = new bootstrap.Modal(consultModalElement);
      consultModal.show();
    }
  }
  closeCreateBookModal(): void {
    const consultModalElement = document.getElementById('createBookModal');
    if (consultModalElement) {
      const consultModal = bootstrap.Modal.getInstance(consultModalElement);
      consultModal?.hide();
    }
  }
  createBook() {
    if (this.createBookForm.valid) {
      console.log("✅ Book created:", this.createBookForm.value);
      this.closeCreateBookModal();
      this.createBookForm.reset()
    }
  }
  
  //  ********************************************************************** Update Book **********************************************************************
  isFormValid(): boolean {
    return this.updateBookForm.valid && this.updateBookForm.dirty;
  }
  initializeUpdateBookForm(): void {
    this.updateBookForm = this.formBuilder.group({
      name: ['', [Validators.pattern('^[a-zA-ZÀ-ÿ0-9\\s]+$')]],
      description: ['', [Validators.pattern('^[a-zA-ZÀ-ÿ0-9\\s]+$')]],
      ISBN: ['', [Validators.pattern('^[0-9]{13}$')]],
      publisher: ['', [Validators.pattern('^[a-zA-ZÀ-ÿ0-9\\s]+$')]],
      bookPlacement: ['', [Validators.pattern('^[a-zA-ZÀ-ÿ0-9\\s]+$')]],
      pages: ['', [Validators.pattern('^[0-9]$')]],
      primaryAuthor: ['', [Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]],
      secondaryAuthor: ['', [Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]],
      publishedDate: [''],
      status: [''],
      language: [''],
      categorie: ['']
    });
  }
  openUpdateModal(Book: Book): void {
    this.selectedBook = Book;
    this.updateBookForm.patchValue(Book);
    const consultModalElement = document.getElementById('updateBookModal');
    if (consultModalElement) {
      const consultModal = new bootstrap.Modal(consultModalElement);
      consultModal.show();
    }
  }
  closeUpdateModal(): void {
    const consultModalElement = document.getElementById('updateBookModal');
    if (consultModalElement) {
      const consultModal = bootstrap.Modal.getInstance(consultModalElement);
      consultModal?.hide();
    }
  }
  updateBook() {
    console.log("✅ Book updated:", this.updateBookForm.value);
    this.closeUpdateModal();
    this.updateBookForm.reset()
  }

  //  ********************************************************************** pagination **********************************************************************
  get paginatedBook(): Book[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredBooks.slice(startIndex, endIndex);
  }
  get totalPages(): number {
    return Math.ceil(this.filteredBooks.length / this.itemsPerPage);
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

  allBooks = [
    {
      idBook: "1",
      name: "To Kill a Mockingbird",
      description: "A novel about racial injustice in the Deep South.",
      status: BookStatus.AVAILABLE,
      ISBN: "9780061120084",
      publishedDate: "1960-07-11",
      publisher: "J.B. Lippincott & Co.",
      language: Language.Arabic,
      pages: 281,
      borrowCount: 15,
      bookPlacement: "Shelf A1",
      primaryAuthor: { idAuthor: "a1", authorName: "Harper Lee", bookHave: 5 },
      secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
      categorie: { idBookCategorie: "c1", name: "Classic", color: "#ffcc00", number: 1, numberOfBooksInCategorie: 3 }
    },
    {
      idBook: "2",
      name: "1984",
      description: "A chilling prophecy about totalitarianism and surveillance.",
      status: BookStatus.BORROWED,
      ISBN: "9780451524935",
      publishedDate: "1949-06-08",
      publisher: "Secker & Warburg",
      language: Language.Arabic,
      pages: 328,
      borrowCount: 20,
      bookPlacement: "Shelf B2",
      primaryAuthor: { idAuthor: "a2", authorName: "George Orwell", bookHave: 5 },
      secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
      categorie: { idBookCategorie: "c2", name: "Dystopian", color: "#0099ff", number: 1, numberOfBooksInCategorie: 3 }
    },
    {
      idBook: "3",
      name: "Pride and Prejudice",
      description: "A classic novel of manners and marriage.",
      status: BookStatus.AVAILABLE,
      ISBN: "9780141439518",
      publishedDate: "1813-01-28",
      publisher: "T. Egerton",
      language: Language.Arabic,
      pages: 279,
      borrowCount: 12,
      bookPlacement: "Shelf C3",
      primaryAuthor: { idAuthor: "a3", authorName: "Jane Austen", bookHave: 5 },
      secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
      categorie: { idBookCategorie: "c3", name: "Romance", color: "#e91e63", number: 1, numberOfBooksInCategorie: 3 }
    },
    {
      idBook: "4",
      name: "The Great Gatsby",
      description: "A story of wealth, love, and the American Dream.",
      status: BookStatus.AVAILABLE,
      ISBN: "9780743273565",
      publishedDate: "1925-04-10",
      publisher: "Charles Scribner's Sons",
      language: Language.Arabic,
      pages: 180,
      borrowCount: 18,
      bookPlacement: "Shelf A2",
      primaryAuthor: { idAuthor: "a4", authorName: "F. Scott Fitzgerald", bookHave: 5 },
      secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
      categorie: { idBookCategorie: "c1", name: "Classic", color: "#ffcc00", number: 2, numberOfBooksInCategorie: 3 }
    },
    {
      idBook: "5",
      name: "Moby-Dick",
      description: "The epic tale of Captain Ahab's obsession with a white whale.",
      status: BookStatus.RESERVED,
      ISBN: "9781503280786",
      publishedDate: "1851-10-18",
      publisher: "Harper & Brothers",
      language: Language.Arabic,
      pages: 635,
      borrowCount: 7,
      bookPlacement: "Shelf D1",
      primaryAuthor: { idAuthor: "a5", authorName: "Herman Melville", bookHave: 5 },
      secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
      categorie: { idBookCategorie: "c4", name: "Adventure", color: "#4caf50", number: 1, numberOfBooksInCategorie: 3 }
    },
    {
      idBook: "6",
      name: "War and Peace",
      description: "A sweeping tale of Russian society during the Napoleonic era.",
      status: BookStatus.AVAILABLE,
      ISBN: "9780199232765",
      publishedDate: "1869-01-01",
      publisher: "The Russian Messenger",
      language: Language.Russian,
      pages: 1225,
      borrowCount: 5,
      bookPlacement: "Shelf E5",
      primaryAuthor: { idAuthor: "a6", authorName: "Leo Tolstoy", bookHave: 5 },
      secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
      categorie: { idBookCategorie: "c5", name: "Historical", color: "#795548", number: 1, numberOfBooksInCategorie: 3 }
    },
    {
      idBook: "7",
      name: "The Catcher in the Rye",
      description: "Holden Caulfield’s experiences in New York City.",
      status: BookStatus.BORROWED,
      ISBN: "9780316769488",
      publishedDate: "1951-07-16",
      publisher: "Little, Brown and Company",
      language: Language.Arabic,
      pages: 234,
      borrowCount: 22,
      bookPlacement: "Shelf F3",
      primaryAuthor: { idAuthor: "a7", authorName: "J.D. Salinger", bookHave: 5 },
      secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
      categorie: { idBookCategorie: "c6", name: "Fiction", color: "#9c27b0", number: 1, numberOfBooksInCategorie: 3 }
    },
    {
      idBook: "8",
      name: "The Hobbit",
      description: "Bilbo Baggins’ unexpected journey to the Lonely Mountain.",
      status: BookStatus.AVAILABLE,
      ISBN: "9780547928227",
      publishedDate: "1937-09-21",
      publisher: "George Allen & Unwin",
      language: Language.Arabic,
      pages: 310,
      borrowCount: 25,
      bookPlacement: "Shelf G2",
      primaryAuthor: { idAuthor: "a8", authorName: "J.R.R. Tolkien", bookHave: 5 },
      secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
      categorie: { idBookCategorie: "c7", name: "Fantasy", color: "#3f51b5", number: 1, numberOfBooksInCategorie: 3 }
    },
    {
      idBook: "9",
      name: "Brave New World",
      description: "A futuristic world of genetically engineered citizens.",
      status: BookStatus.RESERVED,
      ISBN: "9780060850524",
      publishedDate: "1932-01-01",
      publisher: "Chatto & Windus",
      language: Language.Arabic,
      pages: 268,
      borrowCount: 14,
      bookPlacement: "Shelf B5",
      primaryAuthor: { idAuthor: "a9", authorName: "Aldous Huxley", bookHave: 5 },
      secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
      categorie: { idBookCategorie: "c8", name: "Science Fiction", color: "#00bcd4", number: 1, numberOfBooksInCategorie: 3 }
    },
    {
      idBook: "10",
      name: "Crime and Punishment",
      description: "The story of Raskolnikov, a young man who commits a crime.",
      status: BookStatus.AVAILABLE,
      ISBN: "9780143058144",
      publishedDate: "1866-01-01",
      publisher: "The Russian Messenger",
      language: Language.Russian,
      pages: 671,
      borrowCount: 9,
      bookPlacement: "Shelf H1",
      primaryAuthor: { idAuthor: "a10", authorName: "Fyodor Dostoevsky", bookHave: 5 },
      secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
      categorie: { idBookCategorie: "c9", name: "Psychological", color: "#f44336", number: 1, numberOfBooksInCategorie: 3 }
    },
    {
      idBook: "11",
      name: "Harry Potter and the Sorcerer's Stone",
      description: "The beginning of Harry Potter’s magical journey.",
      status: BookStatus.AVAILABLE,
      ISBN: "9780590353427",
      publishedDate: "1997-06-26",
      publisher: "Bloomsbury",
      language: Language.Arabic,
      pages: 223,
      borrowCount: 30,
      bookPlacement: "Shelf G3",
      primaryAuthor: { idAuthor: "a11", authorName: "J.K. Rowling", bookHave: 5 },
      secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
      categorie: { idBookCategorie: "c7", name: "Fantasy", color: "#3f51b5", number: 2, numberOfBooksInCategorie: 3 }
    }
  ]
}
