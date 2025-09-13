import { Gender } from "./Gender";
import { Status } from "./Status";
import { UserCategorie } from "./UserCategorie";

export interface User {
    iduser: string;
    username: string;
    phone_number1: string;
    phone_number2: string;
    date_of_birth: string;
    work: string;
    date_user_create: string;
    membership_date_start: string;
    membership_date_end: string;
    book_borrowed: number;
    gender: Gender;
    membership_status: Status;
    categorie: UserCategorie;
}


//  user ::> work, categorie 
//   book author principal, author secondaire.
//   entite author:  [nom] 
//   collections: nom, numero, nom_sous_collections
//   book emplacement : numero (ar/fr/an) 8-5-77-ar
//   categorie color, nom, numero
