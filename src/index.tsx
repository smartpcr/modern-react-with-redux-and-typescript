import * as React from "react";
import * as ReactDOM from "react-dom";
import { ConnectedBookList } from "./Books/BookList";
import { ConnectedBookDetail } from "./Books/BookDetail";
import { Provider } from "react-redux";
import { DefaultPageContext, configureStore, IStore } from "./Books/BookStore";
import { IReduxContext } from "./Utilities/Store";

const reduxContext: IReduxContext<IStore> = configureStore(new DefaultPageContext());

ReactDOM.render(
    <Provider store={reduxContext.store}>
        <div>
            <ConnectedBookList />
            <ConnectedBookDetail />
        </div>
    </Provider>,
    document.getElementById("container")
);
