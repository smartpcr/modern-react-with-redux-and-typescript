import * as React from "react";
import { connect } from "react-redux";
import { IBook } from './BookModel';
import { IEmptyProps, IStore } from './BookStore';

export interface IBookDetailProps extends IEmptyProps {
    book?: IBook;
}

export class BookDetail extends React.Component<IBookDetailProps> {
    public render(): JSX.Element {
        if (!this.props.book) {
            return <div>Select a book to get started.</div>;
        }

        return (
            <div>
                <h3>Details for:</h3>
                <div>Title: {this.props.book.title}</div>
                <div>Pages: {this.props.book.pages}</div>
            </div>
        );
    }
}

export const mapStateToProps = (state: IStore): IBookDetailProps => {
    return {
        book: state.bookListState.activeBook
    };
}

export const ConnectedBookDetail: React.ComponentClass<IEmptyProps> = connect(mapStateToProps)(BookDetail);

