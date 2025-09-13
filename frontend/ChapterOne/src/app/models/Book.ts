import { Author } from "./Author";
import { BookCategorie } from "./BookCategorie";
import { BookStatus } from "./BookStatus";
import { Language } from "./Language";

export interface Book {
    idBook: string;
    name: string;
    description: string;
    ISBN: string; // id book 13 number
    publishedDate?: string;
    publisher?: string;
    language?: Language;
    bookPlacement: string;
    pages?: number;
    borrowCount?: number;
    primaryAuthor: Author;
    secondaryAuthor: Author;
    status: BookStatus;
    categorie: BookCategorie;
}

//  user ::> work, categorie 
//   book author principal, author secondaire.
//   entite author:  [nom] 
//   collections: nom, numero, nom_sous_collections
//   book emplacement : numero (ar/fr/an) 8-5-77-ar
//   categorie color, nom, numero
