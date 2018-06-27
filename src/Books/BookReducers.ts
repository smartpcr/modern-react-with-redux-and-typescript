import { getDefaultBookList, IBookListState } from './BookStore';
import { BookActions, BookActionTypes } from './BookActions';
import { default as produce } from "immer";

export const bookListReducers = (state: IBookListState, action: BookActions): IBookListState => {
    const oldState = state || getDefaultBookList();

    const newState = produce(oldState, draft => {
        switch(action.type) {
            case BookActionTypes.GetBooks: {
                draft.books = oldState.books;
                break;
            }
            case BookActionTypes.CreateBook: {
                draft.books = [...oldState.books, action.payload];
                break;
            }
            case BookActionTypes.GetBook: {
                draft.activeBook = oldState.books.filter(b=>b.title === action.payload)[0];
                break;
            }
        }
    });

    return newState;
}
