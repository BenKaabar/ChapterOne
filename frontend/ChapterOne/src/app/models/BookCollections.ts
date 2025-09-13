import { Book } from "./Book";

export interface BookCollections {
    name: string;
    number: number;
    bookRelated : Book[];
}