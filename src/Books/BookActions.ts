import { createAction, ActionsUnion } from "../Utilities/ActionHelper";
import { IBook } from './BookModel';

export const enum BookActionTypes {
    GetBooks = "GET_BOOKS",
    GetBook = "GET_BOOK",
    CreateBook = "CREATE_BOOK"
}

export const BookActionsCreator = {
    getBooksAction: () => createAction(BookActionTypes.GetBooks),
    getBookAction: (title: string) => createAction(BookActionTypes.GetBook, title),
    createBookAction: (book:IBook) => createAction(BookActionTypes.CreateBook, book)
}

export type BookActions = ActionsUnion<typeof BookActionsCreator>;
