import { Book } from "./Book";
import { User } from "./Users";

export interface BorrowedList {
    idBorrow: string;
    user: User;
    book: Book;
    borrowDate: string;         
    dueDate: string;            
    returnDate?: string;
}