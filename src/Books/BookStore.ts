import { IBook } from "./BookModel";
import { ReducersMapObject, AnyAction } from 'redux';
import { bookListReducers } from './BookReducers';
import { IWebPageContext, IReduxContext, configureDynamicStore } from '../Utilities/Store';

export interface IStore {
    bookListState: IBookListState;
}

export interface IBookListState {
    books: IBook[];
    activeBook?: IBook;
}

export const getDefaultBookList = (): IBookListState => {
    const store: IBookListState = {
        books: [
            { title: "Javascript: The Good Parts", pages: 101 },
            { title: "Harry Potter", pages: 39 },
            { title: "The Dark Tower", pages: 85 },
            { title: "Eloquent Ruby", pages: 1 }
        ],
        activeBook: undefined
    };

    return store;
};

export interface IEmptyProps {}

export class DefaultPageContext implements IWebPageContext {}

export const configureStore = (ctx: IWebPageContext): IReduxContext<IStore> => {
    const reducers: ReducersMapObject<IStore, AnyAction> = {
        bookListState: bookListReducers
    };

    const initialState: IStore = {
        bookListState: getDefaultBookList()
    };

    const reduxContext = configureDynamicStore<IStore>(
        reducers,
        initialState,
        ctx
    );

    return reduxContext;
}
