import { Component, OnInit } from '@angular/core';
import { Gender } from 'src/app/models/Gender';
import { Status } from 'src/app/models/Status';
import { User } from 'src/app/models/Users';
import { ThemeService } from 'src/app/Services/theme.service';
import * as bootstrap from 'bootstrap';
import { UserCategorie } from 'src/app/models/UserCategorie';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.css']
})
export class ActiveUsersComponent implements OnInit {
  theme: string = 'light';
  user!: User;
  page: number = 1;
  itemsPerPage: number = 8;
  filteredUsers: User[] = [];
  searchTerm: string = '';
  selectedUser: User | null = null;
  createUserForm!: FormGroup;
  updateUserForm!: FormGroup;
  Gender = Gender;
  categorie = UserCategorie;
  status = Status;

  constructor(private themeService: ThemeService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.themeService.theme$.subscribe(t => {
      this.theme = t;
    });
    this.filteredUsers = [...this.allUsers];
    this.initializeCreateUserForm();
    this.initializeUpdateUserForm();
  }

  //  ********************************************************************** Searching **********************************************************************
  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredUsers = this.allUsers.filter(user =>
      user.username.toLowerCase().includes(term) ||
      user.phone_number1.toLowerCase().includes(term) ||
      user.phone_number2.toLowerCase().includes(term) ||
      user.date_of_birth.toLowerCase().includes(term)
    );
    this.page = 1;
  }

  //  ********************************************************************** consulting **********************************************************************
  openConsultModal(user: User): void {
    this.selectedUser = user;
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

  //  ********************************************************************** blocking user **********************************************************************
  openBlockModal(user: User): void {
    this.selectedUser = user;
    const consultModalElement = document.getElementById('blockModal');
    if (consultModalElement) {
      const consultModal = new bootstrap.Modal(consultModalElement);
      consultModal.show();
    }
  }
  closeBlockModal(): void {
    const consultModalElement = document.getElementById('blockModal');
    if (consultModalElement) {
      const consultModal = bootstrap.Modal.getInstance(consultModalElement);
      consultModal?.hide();
    }
  }
  blockuser(idUser: string) {
    console.log(JSON.stringify(idUser))
  }

  //  ********************************************************************** Create user **********************************************************************
  initializeCreateUserForm(): void {
    this.createUserForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]],
      phone_number1: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      phone_number2: ['', [Validators.pattern('^[0-9]{8}$')]],
      date_of_birth: ['', [Validators.required]],
      work: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]],
      gender: ['Male', [Validators.required]]
    });
  }
  openCreateUserModal(): void {
    const consultModalElement = document.getElementById('createUserModal');
    if (consultModalElement) {
      const consultModal = new bootstrap.Modal(consultModalElement);
      consultModal.show();
    }
  }
  closeCreateUserModal(): void {
    const consultModalElement = document.getElementById('createUserModal');
    if (consultModalElement) {
      const consultModal = bootstrap.Modal.getInstance(consultModalElement);
      consultModal?.hide();
    }
  }
  createUser() {
    if (this.createUserForm.valid) {
      console.log("✅ User created:", this.createUserForm.value);
      this.closeCreateUserModal();
      this.createUserForm.reset()
    }
  }

  //  ********************************************************************** Update user **********************************************************************
  isFormValid(): boolean {
    return this.updateUserForm.valid && this.updateUserForm.dirty;
  }
  initializeUpdateUserForm(): void {
    this.updateUserForm = this.formBuilder.group({
      username: ['', [Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]],
      work: ['', [Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]],
      phone_number1: ['', [Validators.pattern('^[0-9]{8}$')]],
      phone_number2: ['', [Validators.pattern('^[0-9]{8}$')]],
      date_of_birth: [''],
      gender: [''],
      categorie: [''],
      membership_status: [''],
      membership_date_start: [''],
      membership_date_end: [''],
      book_borrowed: ['']
    });
  }
  openUpdateModal(user: User): void {
    this.selectedUser = user;
    this.updateUserForm.patchValue(user);
    const consultModalElement = document.getElementById('updateUserModal');
    if (consultModalElement) {
      const consultModal = new bootstrap.Modal(consultModalElement);
      consultModal.show();
    }
  }
  closeUpdateModal(): void {
    const consultModalElement = document.getElementById('updateUserModal');
    if (consultModalElement) {
      const consultModal = bootstrap.Modal.getInstance(consultModalElement);
      consultModal?.hide();
    }
  }
  updateUser() {
    console.log("✅ User updated:", this.updateUserForm.value);
    this.closeUpdateModal();
    this.updateUserForm.reset()
  }

  //  ********************************************************************** pagination **********************************************************************
  get paginatedUser(): User[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }
  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
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
    },
    {
      iduser: 'U005',
      username: 'Eva Green',
      phone_number1: '+7778889999',
      phone_number2: '+9998887777',
      book_borrowed: 2,
      date_of_birth: '1995-11-30',
      gender: Gender.Female,
      membership_status: Status.Inactive,
      categorie: UserCategorie.Old,
      work: 'student',
      date_user_create: '2023-01-02',
      membership_date_start: '2025-05-25',
      membership_date_end: '2026-05-24',
    },
    {
      iduser: 'U006',
      username: 'Frank Taylor',
      phone_number1: '+1011121314',
      phone_number2: '+1413121110',
      book_borrowed: 4,
      date_of_birth: '1988-01-17',
      gender: Gender.Male,
      membership_status: Status.Active,
      categorie: UserCategorie.Old,
      work: 'student',
      date_user_create: '2023-01-02',
      membership_date_start: '2025-05-25',
      membership_date_end: '2026-05-24',
    },
    {
      iduser: 'U007',
      username: 'Grace Lee',
      phone_number1: '+1516171819',
      phone_number2: '+1918171615',
      book_borrowed: 0,
      date_of_birth: '2000-09-05',
      gender: Gender.Female,
      membership_status: Status.Inactive,
      categorie: UserCategorie.Children,
      work: 'student',
      date_user_create: '2023-01-02',
      membership_date_start: '2025-05-25',
      membership_date_end: '2026-05-24',
    },
    {
      iduser: 'U008',
      username: 'Henry King',
      phone_number1: '+2021222324',
      phone_number2: '+2423222120',
      book_borrowed: 1,
      date_of_birth: '1993-06-25',
      gender: Gender.Male,
      membership_status: Status.Block,
      categorie: UserCategorie.Children,
      work: 'student',
      date_user_create: '2023-01-02',
      membership_date_start: '2025-05-25',
      membership_date_end: '2026-05-24',
    },
    {
      iduser: 'U008',
      username: 'Henry King',
      phone_number1: '+2021222324',
      phone_number2: '+2423222120',
      book_borrowed: 1,
      date_of_birth: '1993-06-25',
      gender: Gender.Male,
      membership_status: Status.Block,
      categorie: UserCategorie.Old,
      work: 'student',
      date_user_create: '2023-01-02',
      membership_date_start: '2025-05-25',
      membership_date_end: '2026-05-24',
    },
    {
      iduser: 'U009',
      username: 'Isabel Martinez',
      phone_number1: '+2526272829',
      phone_number2: '+2928272625',
      book_borrowed: 2,
      date_of_birth: '1997-08-19',
      gender: Gender.Female,
      membership_status: Status.Active,
      categorie: UserCategorie.Old,
      work: 'student',
      date_user_create: '2023-01-02',
      membership_date_start: '2025-05-25',
      membership_date_end: '2026-05-24',
    },
    {
      iduser: 'U010',
      username: 'Jack Wilson',
      phone_number1: '+3031323334',
      phone_number2: '+3433323130',
      book_borrowed: 3,
      date_of_birth: '1991-04-12',
      gender: Gender.Male,
      membership_status: Status.Active,
      categorie: UserCategorie.Children,
      work: 'student',
      date_user_create: '2023-01-02',
      membership_date_start: '2025-05-25',
      membership_date_end: '2026-05-24',
    }
  ]
}

