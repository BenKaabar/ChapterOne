import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { DashboardComponent } from './Components/Dashboard/dashboard.component';
import { AuthorComponent } from './Components/Books/author/author.component';
import { AvailableBooksComponent } from './Components/Books/available-books/available-books.component';
import { CategorieBooksComponent } from './Components/Books/categorie-books/categorie-books.component';
import { CollectionsComponent } from './Components/Books/collections/collections.component';
import { PlacementBooksComponent } from './Components/Books/placement-books/placement-books.component';
import { ActiveUsersComponent } from './Components/Users/active-users/active-users.component';
import { BlockUsersComponent } from './Components/Users/block-users/block-users.component';
import { InactiveUsersComponent } from './Components/Users/inactive-users/inactive-users.component';
import { PlacementBookDetailsComponent } from './Components/Books/placement-book-details/placement-book-details.component';
import { CurrentBorrowedComponent } from './Components/Borrow/current-borrowed/current-borrowed.component';
import { LateBorrowedComponent } from './Components/Borrow/late-borrowed/late-borrowed.component';
import { AllBorrowedComponent } from './Components/Borrow/all-borrowed/all-borrowed.component';
import { UserComponent } from './Components/Statistics/user/user.component';
import { BookComponent } from './Components/Statistics/book/book.component';
import { BorrowComponent } from './Components/Statistics/borrow/borrow.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    InactiveUsersComponent,
    ActiveUsersComponent,
    BlockUsersComponent,
    AvailableBooksComponent,
    AuthorComponent,
    CategorieBooksComponent,
    PlacementBooksComponent,
    CollectionsComponent,
    PlacementBookDetailsComponent,
    CurrentBorrowedComponent,
    LateBorrowedComponent,
    AllBorrowedComponent,
    UserComponent,
    BookComponent,
    BorrowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // for router-outlet
    FormsModule,    // for [(ngModel)]
    NgChartsModule, // for charts
    ReactiveFormsModule //for forms 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
