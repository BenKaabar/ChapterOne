import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { Book } from 'src/app/models/Book';
import { BookCollections } from 'src/app/models/BookCollections';
import { BookStatus } from 'src/app/models/BookStatus';
import { Language } from 'src/app/models/Language';
import { ThemeService } from 'src/app/Services/theme.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {
  theme: string = 'light';
  page: number = 1;
  itemsPerPage: number = 8;
  pageBook: number = 1;
  itemsPerPageBook: number = 5;
  filteredCollections: BookCollections[] = [];
  searchTerm: string = '';
  selectedCollection!: BookCollections;
  updateCollectionForm!: FormGroup;
  createCollectionForm!: FormGroup;
  selectedBooks: string[] = [];
  dropdownOpen: boolean = false;

  constructor(private themeService: ThemeService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.themeService.theme$.subscribe(t => {
      this.theme = t;
    });
    this.filteredCollections = this.AllCollection;
    this.initializecreateCollectionForm();
    this.initializeupdateCollectionForm();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.dropdownOpen = false;
  }

  //  ********************************************************************** Searching **********************************************************************
  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredCollections = this.AllCollection.filter(collection =>
      collection.name.toLowerCase().includes(term)
    );
    this.page = 1;
  }

  //  ********************************************************************** consulting **********************************************************************
  openConsultModal(collection: BookCollections): void {
    this.selectedCollection = collection;
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
  initializecreateCollectionForm(): void {
    this.createCollectionForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ0-9\\s]+$')]]
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
    if (this.createCollectionForm.valid) {
      console.log("✅ Collection created:", this.createCollectionForm.value);
      this.closeCreateBookModal();
      this.createCollectionForm.reset()
    }
  }

  //  ********************************************************************** Update Book **********************************************************************
  isFormValid(): boolean {
    return this.updateCollectionForm.valid && (this.updateCollectionForm.dirty || this.selectedBooks.length > 0);
  }
  initializeupdateCollectionForm(): void {
    this.updateCollectionForm = this.formBuilder.group({
      name: ['', [Validators.pattern('^[a-zA-ZÀ-ÿ0-9\\s]+$')]],
    });
  }
  openUpdateModal(collection: BookCollections): void {
    this.selectedCollection = collection;
    this.updateCollectionForm.patchValue(collection);
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
  updateCollection() {
    console.log("✅ Collection updated:", this.updateCollectionForm.value);
    console.log("📚 Selected Books:", this.selectedBooks);
    this.closeUpdateModal();
    this.updateCollectionForm.reset()
  }
  onBookSelect(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      if (!this.selectedBooks.includes(value)) this.selectedBooks.push(value);
    } else {
      this.selectedBooks = this.selectedBooks.filter(item => item !== value);
    }
  }
  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  //  ********************************************************************** pagination **********************************************************************
  get paginatedCollection(): BookCollections[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCollections.slice(startIndex, endIndex);
  }
  get totalPages(): number {
    return Math.ceil(this.filteredCollections.length / this.itemsPerPage);
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

  //  ********************************************************************** pagination book **********************************************************************
  get paginatedBook(): Book[] {
    const startIndex = (this.pageBook - 1) * this.itemsPerPageBook;
    const endIndex = startIndex + this.itemsPerPageBook;
    return this.selectedCollection?.bookRelated.slice(startIndex, endIndex);
  }
  get totalPagesBook(): number {
    return Math.ceil(this.selectedCollection?.bookRelated.length / this.itemsPerPageBook);
  }
  get isPreviousPageDisabledBook(): boolean {
    return this.pageBook === 1;
  }
  get isNextPageDisabledBook(): boolean {
    return this.pageBook === this.totalPagesBook;
  }
  goToNextPageBook(): void {
    if (this.pageBook < this.totalPages) {
      this.pageBook++;
    }
  }
  goToPreviousPageBook(): void {
    if (this.pageBook > 1) {
      this.pageBook--;
    }
  }

  AllCollection = [
    {
      name: "Classics",
      number: 3,
      bookRelated: [
        {
          idBook: "1",
          name: "To Kill a Mockingbird",
          description: "A novel about racial injustice in the Deep South.",
          status: BookStatus.AVAILABLE,
          ISBN: "9780061120084",
          publishedDate: "1960-07-11",
          publisher: "J.B. Lippincott & Co.",
          language: Language.English,
          pages: 281,
          borrowCount: 15,
          bookPlacement: "Shelf A1",
          primaryAuthor: { idAuthor: "a1", authorName: "Harper Lee", bookHave: 5 },
          secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
          categorie: { idBookCategorie: "c1", name: "Classic", color: "#ffcc00", number: 1, numberOfBooksInCategorie: 3 }
        },
        {
          idBook: "2",
          name: "Dune",
          description: "Epic science fiction novel set on the desert planet Arrakis.",
          status: BookStatus.BORROWED,
          ISBN: "9780441013593",
          publishedDate: "1965-08-01",
          publisher: "Chilton Books",
          language: Language.English,
          pages: 412,
          borrowCount: 22,
          bookPlacement: "Shelf B2",
          primaryAuthor: { idAuthor: "a2", authorName: "Frank Herbert", bookHave: 10 },
          secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
          categorie: { idBookCategorie: "c2", name: "Sci-Fi", color: "#00ccff", number: 2, numberOfBooksInCategorie: 4 }
        },
        {
          idBook: "2",
          name: "Dune",
          description: "Epic science fiction novel set on the desert planet Arrakis.",
          status: BookStatus.BORROWED,
          ISBN: "9780441013593",
          publishedDate: "1965-08-01",
          publisher: "Chilton Books",
          language: Language.English,
          pages: 412,
          borrowCount: 22,
          bookPlacement: "Shelf B2",
          primaryAuthor: { idAuthor: "a2", authorName: "Frank Herbert", bookHave: 10 },
          secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
          categorie: { idBookCategorie: "c2", name: "Sci-Fi", color: "#00ccff", number: 2, numberOfBooksInCategorie: 4 }
        },
        {
          idBook: "1",
          name: "To Kill a Mockingbird",
          description: "A novel about racial injustice in the Deep South.",
          status: BookStatus.AVAILABLE,
          ISBN: "9780061120084",
          publishedDate: "1960-07-11",
          publisher: "J.B. Lippincott & Co.",
          language: Language.English,
          pages: 281,
          borrowCount: 15,
          bookPlacement: "Shelf A1",
          primaryAuthor: { idAuthor: "a1", authorName: "Harper Lee", bookHave: 5 },
          secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
          categorie: { idBookCategorie: "c1", name: "Classic", color: "#ffcc00", number: 1, numberOfBooksInCategorie: 3 }
        },
        {
          idBook: "2",
          name: "Dune",
          description: "Epic science fiction novel set on the desert planet Arrakis.",
          status: BookStatus.BORROWED,
          ISBN: "9780441013593",
          publishedDate: "1965-08-01",
          publisher: "Chilton Books",
          language: Language.English,
          pages: 412,
          borrowCount: 22,
          bookPlacement: "Shelf B2",
          primaryAuthor: { idAuthor: "a2", authorName: "Frank Herbert", bookHave: 10 },
          secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
          categorie: { idBookCategorie: "c2", name: "Sci-Fi", color: "#00ccff", number: 2, numberOfBooksInCategorie: 4 }
        },
        {
          idBook: "2",
          name: "Dune",
          description: "Epic science fiction novel set on the desert planet Arrakis.",
          status: BookStatus.BORROWED,
          ISBN: "9780441013593",
          publishedDate: "1965-08-01",
          publisher: "Chilton Books",
          language: Language.English,
          pages: 412,
          borrowCount: 22,
          bookPlacement: "Shelf B2",
          primaryAuthor: { idAuthor: "a2", authorName: "Frank Herbert", bookHave: 10 },
          secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
          categorie: { idBookCategorie: "c2", name: "Sci-Fi", color: "#00ccff", number: 2, numberOfBooksInCategorie: 4 }
        }
      ]
    },
    {
      name: "Science Fiction",
      number: 4,
      bookRelated: [
        {
          idBook: "2",
          name: "Dune",
          description: "Epic science fiction novel set on the desert planet Arrakis.",
          status: BookStatus.BORROWED,
          ISBN: "9780441013593",
          publishedDate: "1965-08-01",
          publisher: "Chilton Books",
          language: Language.English,
          pages: 412,
          borrowCount: 22,
          bookPlacement: "Shelf B2",
          primaryAuthor: { idAuthor: "a2", authorName: "Frank Herbert", bookHave: 10 },
          secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
          categorie: { idBookCategorie: "c2", name: "Sci-Fi", color: "#00ccff", number: 2, numberOfBooksInCategorie: 4 }
        }
      ]
    },
    {
      name: "Fantasy",
      number: 5,
      bookRelated: [
        {
          idBook: "3",
          name: "The Hobbit",
          description: "Fantasy adventure novel by J.R.R. Tolkien.",
          status: BookStatus.AVAILABLE,
          ISBN: "9780547928227",
          publishedDate: "1937-09-21",
          publisher: "George Allen & Unwin",
          language: Language.English,
          pages: 310,
          borrowCount: 30,
          bookPlacement: "Shelf C1",
          primaryAuthor: { idAuthor: "a3", authorName: "J.R.R. Tolkien", bookHave: 12 },
          secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
          categorie: { idBookCategorie: "c3", name: "Fantasy", color: "#66cc66", number: 3, numberOfBooksInCategorie: 5 }
        }
      ]
    },
    {
      name: "Mystery",
      number: 4,
      bookRelated: [
        {
          idBook: "4",
          name: "The Girl with the Dragon Tattoo",
          description: "Crime novel by Stieg Larsson.",
          status: BookStatus.RESERVED,
          ISBN: "9780307949486",
          publishedDate: "2005-08-01",
          publisher: "Norstedts Förlag",
          language: Language.Arabic,
          pages: 465,
          borrowCount: 18,
          bookPlacement: "Shelf D1",
          primaryAuthor: { idAuthor: "a4", authorName: "Stieg Larsson", bookHave: 3 },
          secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
          categorie: { idBookCategorie: "c4", name: "Mystery", color: "#ff6666", number: 4, numberOfBooksInCategorie: 4 }
        }
      ]
    },
    {
      name: "Non-Fiction",
      number: 6,
      bookRelated: [
        {
          idBook: "5",
          name: "Sapiens: A Brief History of Humankind",
          description: "Exploration of human history and evolution.",
          status: BookStatus.AVAILABLE,
          ISBN: "9780062316097",
          publishedDate: "2011-01-01",
          publisher: "Harper",
          language: Language.English,
          pages: 498,
          borrowCount: 40,
          bookPlacement: "Shelf E2",
          primaryAuthor: { idAuthor: "a5", authorName: "Yuval Noah Harari", bookHave: 6 },
          secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
          categorie: { idBookCategorie: "c5", name: "Non-Fiction", color: "#9933ff", number: 5, numberOfBooksInCategorie: 6 }
        }
      ]
    },
    {
      name: "Biographies",
      number: 3,
      bookRelated: [
        {
          idBook: "6",
          name: "The Diary of a Young Girl",
          description: "Anne Frank's diary from World War II.",
          status: BookStatus.BORROWED,
          ISBN: "9780553296983",
          publishedDate: "1947-06-25",
          publisher: "Contact Publishing",
          language: Language.Hindi,
          pages: 283,
          borrowCount: 12,
          bookPlacement: "Shelf F1",
          primaryAuthor: { idAuthor: "a6", authorName: "Anne Frank", bookHave: 1 },
          secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
          categorie: { idBookCategorie: "c6", name: "Biography", color: "#ff9966", number: 6, numberOfBooksInCategorie: 3 }
        }
      ]
    },
    {
      name: "Romance",
      number: 7,
      bookRelated: [
        {
          idBook: "7",
          name: "Pride and Prejudice",
          description: "Classic romance novel by Jane Austen.",
          status: BookStatus.AVAILABLE,
          ISBN: "9781503290563",
          publishedDate: "1813-01-28",
          publisher: "T. Egerton",
          language: Language.English,
          pages: 279,
          borrowCount: 25,
          bookPlacement: "Shelf G1",
          primaryAuthor: { idAuthor: "a7", authorName: "Jane Austen", bookHave: 8 },
          secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
          categorie: { idBookCategorie: "c7", name: "Romance", color: "#ff3399", number: 7, numberOfBooksInCategorie: 7 }
        }
      ]
    },
    {
      name: "History",
      number: 5,
      bookRelated: [
        {
          idBook: "8",
          name: "Guns, Germs, and Steel",
          description: "Explores how societies developed differently.",
          status: BookStatus.AVAILABLE,
          ISBN: "9780393317558",
          publishedDate: "1997-03-01",
          publisher: "W. W. Norton & Company",
          language: Language.English,
          pages: 480,
          borrowCount: 14,
          bookPlacement: "Shelf H2",
          primaryAuthor: { idAuthor: "a8", authorName: "Jared Diamond", bookHave: 4 },
          secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
          categorie: { idBookCategorie: "c8", name: "History", color: "#6699ff", number: 8, numberOfBooksInCategorie: 5 }
        }
      ]
    },
    {
      name: "Self-Help",
      number: 6,
      bookRelated: [
        {
          idBook: "9",
          name: "The Power of Habit",
          description: "Why we do what we do in life and business.",
          status: BookStatus.RESERVED,
          ISBN: "9780812981605",
          publishedDate: "2012-02-28",
          publisher: "Random House",
          language: Language.English,
          pages: 371,
          borrowCount: 20,
          bookPlacement: "Shelf I1",
          primaryAuthor: { idAuthor: "a9", authorName: "Charles Duhigg", bookHave: 2 },
          secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
          categorie: { idBookCategorie: "c9", name: "Self-Help", color: "#33cccc", number: 9, numberOfBooksInCategorie: 6 }
        }
      ]
    },
    {
      name: "Children's Books",
      number: 8,
      bookRelated: [
        {
          idBook: "10",
          name: "Harry Potter and the Sorcerer's Stone",
          description: "First book of the Harry Potter series.",
          status: BookStatus.AVAILABLE,
          ISBN: "9780590353427",
          publishedDate: "1997-06-26",
          publisher: "Bloomsbury",
          language: Language.English,
          pages: 309,
          borrowCount: 50,
          bookPlacement: "Shelf J1",
          primaryAuthor: { idAuthor: "a10", authorName: "J.K. Rowling", bookHave: 15 },
          secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
          categorie: { idBookCategorie: "c10", name: "Children", color: "#ffccff", number: 10, numberOfBooksInCategorie: 8 }
        }
      ]
    }
  ]

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
