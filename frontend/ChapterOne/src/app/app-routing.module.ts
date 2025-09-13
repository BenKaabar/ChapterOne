import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorComponent } from './Components/Books/author/author.component';
import { AvailableBooksComponent } from './Components/Books/available-books/available-books.component';
import { CategorieBooksComponent } from './Components/Books/categorie-books/categorie-books.component';
import { CollectionsComponent } from './Components/Books/collections/collections.component';
import { PlacementBooksComponent } from './Components/Books/placement-books/placement-books.component';
import { DashboardComponent } from './Components/Dashboard/dashboard.component';
import { ActiveUsersComponent } from './Components/Users/active-users/active-users.component';
import { BlockUsersComponent } from './Components/Users/block-users/block-users.component';
import { InactiveUsersComponent } from './Components/Users/inactive-users/inactive-users.component';
import { PlacementBookDetailsComponent } from './Components/Books/placement-book-details/placement-book-details.component';
import { CurrentBorrowedComponent } from './Components/Borrow/current-borrowed/current-borrowed.component';
import { LateBorrowedComponent } from './Components/Borrow/late-borrowed/late-borrowed.component';
import { AllBorrowedComponent } from './Components/Borrow/all-borrowed/all-borrowed.component';
import { BookComponent } from './Components/Statistics/book/book.component';
import { BorrowComponent } from './Components/Statistics/borrow/borrow.component';
import { UserComponent } from './Components/Statistics/user/user.component';

const routes: Routes = [
  {
    path: "Dashboard", component: DashboardComponent, children: [
      // Users
      { path: "ActiveUsers", component: ActiveUsersComponent },
      { path: "InactiveUsers", component: InactiveUsersComponent },
      { path: "BlockUsers", component: BlockUsersComponent },
      // Books
      { path: "Author", component: AuthorComponent },
      { path: "AvailableBooks", component: AvailableBooksComponent },
      { path: "Collections", component: CollectionsComponent },
      { path: "PlacementBooks", component: PlacementBooksComponent },
      { path: "Categorie", component: CategorieBooksComponent },
      { path: "PlacementDetails", component: PlacementBookDetailsComponent },
      // Borrow
      { path: "AllBorrowed", component: AllBorrowedComponent },
      { path: "CurrentBorrowed", component: CurrentBorrowedComponent },
      { path: "LateBorrowed", component: LateBorrowedComponent },
      // Statistics
      { path: "StatisticsUser", component: UserComponent },
      { path: "StatisticsBook", component: BookComponent },
      { path: "StatisticsBorrow", component: BorrowComponent },
      { path: '', redirectTo: '/ActiveUsers', pathMatch: 'full' }
    ]
  },

  { path: '', redirectTo: '/Dashboard/ActiveUsers', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
