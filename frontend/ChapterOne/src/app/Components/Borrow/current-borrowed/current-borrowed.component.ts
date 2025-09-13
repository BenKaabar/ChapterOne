import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { BookStatus } from 'src/app/models/BookStatus';
import { BorrowedList } from 'src/app/models/BorrowedList';
import { Gender } from 'src/app/models/Gender';
import { Language } from 'src/app/models/Language';
import { Status } from 'src/app/models/Status';
import { UserCategorie } from 'src/app/models/UserCategorie';
import { ThemeService } from 'src/app/Services/theme.service';

@Component({
  selector: 'app-current-borrowed',
  templateUrl: './current-borrowed.component.html',
  styleUrls: ['./current-borrowed.component.css']
})
export class CurrentBorrowedComponent implements OnInit {
  theme: string = 'light';
  page: number = 1;
  itemsPerPage: number = 8;
  filteredBorrows: BorrowedList[] = [];
  searchTerm: string = '';
  selectedBorrowedList: BorrowedList | null = null;
  createBorrowForm!: FormGroup;
  updateBorrowForm!: FormGroup;
  Gender = Gender;
  categorie = UserCategorie;
  status = Status;
  dropdownOpenBook: boolean = false;
  dropdownOpenUser: boolean = false;
  selectedBooks: string[] = [];
  bookStatus = BookStatus;

  constructor(private themeService: ThemeService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.themeService.theme$.subscribe(t => {
      this.theme = t;
    });
    this.filteredBorrows = [...this.listBorrow];
    this.initializeCreateBorrowForm();
    this.initializeUpdateBorrowForm();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const bookDropdown = document.querySelector('.dropdown.book');
    const userDropdown = document.querySelector('.dropdown.user');

    const clickedInsideBook = bookDropdown?.contains(target);
    const clickedInsideUser = userDropdown?.contains(target);

    if (!clickedInsideBook) {
      this.dropdownOpenBook = false;
    }
    if (!clickedInsideUser) {
      this.dropdownOpenUser = false;
    }
  }

  //  ********************************************************************** Searching **********************************************************************
  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredBorrows = this.listBorrow.filter(borrow =>
      borrow.book.name.toLowerCase().includes(term) ||
      borrow.user.username.toLowerCase().includes(term) ||
      borrow.user.phone_number1.toLowerCase().includes(term) ||
      borrow.user.phone_number2.toLowerCase().includes(term) ||
      borrow.borrowDate.toLowerCase().includes(term)
    );
    this.page = 1;
  }

  //  ********************************************************************** consulting **********************************************************************
  openConsultModal(borrowedList: BorrowedList): void {
    this.selectedBorrowedList = borrowedList;
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

  //  ********************************************************************** Create user **********************************************************************
  initializeCreateBorrowForm(): void {
    this.createBorrowForm = this.formBuilder.group({
      idUser: ['', [Validators.required]],
      idBook: ['', [Validators.required]],
      borrowDate: [''],
      returnDate: [''],
    });
  }
  openCreateBorrowModal(): void {
    const consultModalElement = document.getElementById('createBorrowModal');
    if (consultModalElement) {
      const consultModal = new bootstrap.Modal(consultModalElement);
      consultModal.show();
    }
  }
  closeCreateBorrowModal(): void {
    const consultModalElement = document.getElementById('createBorrowModal');
    if (consultModalElement) {
      const consultModal = bootstrap.Modal.getInstance(consultModalElement);
      consultModal?.hide();
    }
  }
  createBorrow() {
    if (this.createBorrowForm.valid) {
      console.log("✅ Borrow created:", this.createBorrowForm.value);
      this.closeCreateBorrowModal();
      this.createBorrowForm.reset()
    }
  }
  toggleDropdownUser(event: Event) {
    event.stopPropagation();
    this.dropdownOpenUser = !this.dropdownOpenUser;
  }
  toggleDropdownBook(event: Event) {
    event.stopPropagation();
    this.dropdownOpenBook = !this.dropdownOpenBook;
  }

  //  ********************************************************************** Update Borrow **********************************************************************
  isFormValid(): boolean {
    return this.updateBorrowForm.valid && this.updateBorrowForm.dirty;
  }
  initializeUpdateBorrowForm(): void {
    this.updateBorrowForm = this.formBuilder.group({
      idUser: [''],
      idBook: [''],
      borrowDate: [''],
      returnDate: [''],
      BookStatus: ['']
    });
  }
  openUpdateModal(borrowedList: BorrowedList): void {
    this.selectedBorrowedList = borrowedList;
    console.log(this.selectedBorrowedList);
    this.updateBorrowForm.patchValue({
      idUser: borrowedList.user?.iduser,
      idBook: borrowedList.book?.idBook,
      borrowDate: borrowedList.borrowDate,
      returnDate: borrowedList.returnDate,
      BookStatus: this.selectedBorrowedList.book.status
    });
    const consultModalElement = document.getElementById('updateBorrowModal');
    if (consultModalElement) {
      const consultModal = new bootstrap.Modal(consultModalElement);
      consultModal.show();
    }
  }
  closeUpdateModal(): void {
    const consultModalElement = document.getElementById('updateBorrowModal');
    if (consultModalElement) {
      const consultModal = bootstrap.Modal.getInstance(consultModalElement);
      consultModal?.hide();
    }
  }
  updateBorrow() {
    console.log("✅ Borrow updated:", this.updateBorrowForm.value);
    this.closeUpdateModal();
    this.updateBorrowForm.reset()
  }

  //  ********************************************************************** Switch To Available Book **********************************************************************
  openAvailableModal(borrowedList: BorrowedList): void {
    this.selectedBorrowedList = borrowedList;
    const consultModalElement = document.getElementById('updateAvailableModal');
    if (consultModalElement) {
      const consultModal = new bootstrap.Modal(consultModalElement);
      consultModal.show();
    }
  }
  closeAvailableModal(): void {
    const consultModalElement = document.getElementById('updateAvailableModal');
    if (consultModalElement) {
      const consultModal = bootstrap.Modal.getInstance(consultModalElement);
      consultModal?.hide();
    }
  }
  AvailableBorrow(idBook: string) {
    console.log("✅ Available updated:", idBook);
    this.closeAvailableModal();
  }

  //  ********************************************************************** pagination **********************************************************************
  get paginatedBorrow(): BorrowedList[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredBorrows.slice(startIndex, endIndex);
  }
  get totalPages(): number {
    return Math.ceil(this.filteredBorrows.length / this.itemsPerPage);
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

  listBorrow = [
    {
      user: {
        iduser: 'U001',
        username: 'Alice Johnson',
        phone_number1: '34567890',
        phone_number2: '87654321',
        book_borrowed: 3,
        date_of_birth: '1990-05-15',
        gender: Gender.Female,
        membership_status: Status.Active,
        categorie: UserCategorie.Old,
        work: 'Student',
        date_user_create: '2023-01-02',
        membership_date_start: '2025-05-25',
        membership_date_end: '2026-05-24',
      },
      book: {
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
      idBorrow: '1',
      borrowDate: "2025-01-10",
      returnDate: "2025-02-05",
      dueDate: "2025-02-05"
    },
    {
      user: {
        iduser: 'U002',
        username: 'Michael Smith',
        phone_number1: '44556677',
        phone_number2: '99887766',
        book_borrowed: 2,
        date_of_birth: '1988-09-23',
        gender: Gender.Male,
        membership_status: Status.Active,
        categorie: UserCategorie.Old,
        work: 'Engineer',
        date_user_create: '2023-04-12',
        membership_date_start: '2025-03-01',
        membership_date_end: '2026-03-01',
      },
      book: {
        idBook: "2",
        name: "1984",
        description: "A chilling prophecy about totalitarianism and surveillance.",
        status: BookStatus.BORROWED,
        ISBN: "9780451524935",
        publishedDate: "1949-06-08",
        publisher: "Secker & Warburg",
        language: Language.English,
        pages: 328,
        borrowCount: 20,
        bookPlacement: "Shelf B2",
        primaryAuthor: { idAuthor: "a2", authorName: "George Orwell", bookHave: 5 },
        secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
        categorie: { idBookCategorie: "c2", name: "Dystopian", color: "#0099ff", number: 1, numberOfBooksInCategorie: 3 }
      },
      idBorrow: '2',
      borrowDate: "2025-02-15",
      returnDate: "2025-03-20",
      dueDate: "2025-02-05"
    },
    {
      user: {
        iduser: 'U003',
        username: 'Emma Brown',
        phone_number1: '12345678',
        phone_number2: '87654321',
        book_borrowed: 1,
        date_of_birth: '1995-03-10',
        gender: Gender.Female,
        membership_status: Status.Active,
        categorie: UserCategorie.Old,
        work: 'Teacher',
        date_user_create: '2022-11-20',
        membership_date_start: '2025-06-01',
        membership_date_end: '2026-06-01',
      },
      book: {
        idBook: "3",
        name: "Pride and Prejudice",
        description: "A romantic novel that critiques societal expectations.",
        status: BookStatus.AVAILABLE,
        ISBN: "9781503290563",
        publishedDate: "1813-01-28",
        publisher: "T. Egerton",
        language: Language.French,
        pages: 279,
        borrowCount: 12,
        bookPlacement: "Shelf C1",
        primaryAuthor: { idAuthor: "a3", authorName: "Jane Austen", bookHave: 7 },
        secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
        categorie: { idBookCategorie: "c3", name: "Romance", color: "#ff6699", number: 1, numberOfBooksInCategorie: 4 }
      },
      idBorrow: '3',
      borrowDate: "2025-03-02",
      returnDate: "2025-03-20",
      dueDate: "2025-02-05"
    },
    {
      user: {
        iduser: 'U004',
        username: 'David Wilson',
        phone_number1: '55667788',
        phone_number2: '11223344',
        book_borrowed: 4,
        date_of_birth: '1992-07-19',
        gender: Gender.Male,
        membership_status: Status.Inactive,
        categorie: UserCategorie.Children,
        work: 'Designer',
        date_user_create: '2021-08-01',
        membership_date_start: '2024-07-10',
        membership_date_end: '2025-07-10',
      },
      book: {
        idBook: "4",
        name: "The Great Gatsby",
        description: "A novel about the American Dream and disillusionment.",
        status: BookStatus.BORROWED,
        ISBN: "9780743273565",
        publishedDate: "1925-04-10",
        publisher: "Charles Scribner's Sons",
        language: Language.Arabic,
        pages: 180,
        borrowCount: 18,
        bookPlacement: "Shelf D4",
        primaryAuthor: { idAuthor: "a4", authorName: "F. Scott Fitzgerald", bookHave: 6 },
        secondaryAuthor: { idAuthor: "", authorName: "", bookHave: 0 },
        categorie: { idBookCategorie: "c4", name: "Novel", color: "#33cc33", number: 1, numberOfBooksInCategorie: 5 }
      },
      idBorrow: '4',
      borrowDate: "2025-04-01",
      returnDate: "2025-03-20",
      dueDate: "2025-02-05"
    }
  ]
  allUsers = [
    {
      iduser: 'U001',
      username: 'Alice Johnson',
      phone_number1: '34567890',
      phone_number2: '87654321',
      book_borrowed: 3,
      date_of_birth: '1990-05-15',
      gender: Gender.Female,
      membership_status: Status.Active,
      categorie: UserCategorie.Old,
      work: 'student',
      date_user_create: '2023-01-02',
      membership_date_start: '2025-05-25',
      membership_date_end: '2026-05-24',
    },
    {
      iduser: 'U002',
      username: 'Bob Smith',
      phone_number1: '+1234509876',
      phone_number2: '+0987612345',
      book_borrowed: 1,
      date_of_birth: '1985-12-03',
      gender: Gender.Male,
      membership_status: Status.Active,
      categorie: UserCategorie.Old,
      work: 'student',
      date_user_create: '2023-01-02',
      membership_date_start: '2025-05-25',
      membership_date_end: '2026-05-24',
    },
    {
      iduser: 'U003',
      username: 'Carol White',
      phone_number1: '+1112223333',
      phone_number2: '+3332221111',
      book_borrowed: 0,
      date_of_birth: '1998-07-21',
      gender: Gender.Female,
      membership_status: Status.Inactive,
      categorie: UserCategorie.Youths,
      work: 'student',
      date_user_create: '2023-01-02',
      membership_date_start: '2025-05-25',
      membership_date_end: '2026-05-24',
    },
    {
      iduser: 'U004',
      username: 'David Brown',
      phone_number1: '+4445556666',
      phone_number2: '+6665554444',
      book_borrowed: 5,
      date_of_birth: '1992-03-10',
      gender: Gender.Male,
      membership_status: Status.Active,
      categorie: UserCategorie.Youths,
      work: 'student',
      date_user_create: '2023-01-02',
      membership_date_start: '2025-05-25',
      membership_date_end: '2026-05-24',
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
      idBook: "6",
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
      idBook: "7",
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
      idBook: "8",
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
    }
  ]
}

