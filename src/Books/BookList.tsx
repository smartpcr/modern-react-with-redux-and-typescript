import * as React from "react";
import { IEmptyProps, IStore } from './BookStore';
import { IBook } from './BookModel';
import { Dispatch } from 'redux';
import { BookActionsCreator } from './BookActions';
import { connect } from 'react-redux';

export interface IBookListProps extends IEmptyProps {
    books: IBook[];
    selectBook: (book:IBook)=> void;
}

export class BookList extends React.Component<IBookListProps> {
    public render(): JSX.Element {
        return (
            <ul className="list-group col-md-4">
            {this.renderList()}
            </ul>
        );
    }

    private renderList = (): JSX.Element[] => {
        return this.props.books.map(book => {
            return (
                <li key={book.title} onClick={()=>this.props.selectBook(book)} className="list-group-item">
                {book.title}
                </li>
            );
        });
    }
}

export const mapStateToProps = (state: IStore): Partial<IBookListProps> => {
    return {
        books: state.bookListState.books
    };
}

export const mapDispatchToProps = (dispatch: Dispatch): Partial<IBookListProps> => {
    return {
        selectBook: (book: IBook) => dispatch(BookActionsCreator.getBookAction(book.title))
    };
}

export const ConnectedBookList: React.ComponentClass<IEmptyProps> = connect(mapStateToProps, mapDispatchToProps)(BookList);
