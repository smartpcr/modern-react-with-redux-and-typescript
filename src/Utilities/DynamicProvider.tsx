/// <amd-module name="redux/Components/DynamicProvider" />
import * as React from "react";
import { Provider } from "react-redux";
import { Reducer } from "redux";
import { Task } from "redux-saga";
import { IReduxContext } from "./Store";
import { DynamicProviderActionsCreator } from './DynamicProviderActions';

export interface IDynamicProviderProps {
    /** The redux context to use */
    reduxContext: IReduxContext<any>;
    /** The optional reducer to register with the system */
    reducer?: Reducer<any>;
    /** The key with which to register this reducer */
    reducerKey?: string;
    /**  The optional saga to start */
    saga?: () => Iterator<any>;
}

/**
 * The DynamicProvider wraps the default Redux Provider, but also adds a way to register Redux reducers and Redux sagas on mount
 * When this component is initialized, the reducer and saga passed as props will be registered with the system
 * On unmount, they will be unregistered
 */
export class DynamicProvider extends React.Component<IDynamicProviderProps> {
    private _saga: Task | undefined;

    constructor(props: IDynamicProviderProps, context: any) {
        super(props, context);

        const {
            reducer,
            reducerKey,
            reduxContext: {
                store,
                sagaMiddleware
            },
            saga
        } = props;

        // Register the saga first, so it can potentially respond to the mount action if required
        if (saga) {
            this._saga = sagaMiddleware.run(saga);
        }

        // Register the reducer, then dispacth a mount action
        if (reducer && reducerKey) {
            store.addReducer(reducerKey, reducer);
        }
    }

    /**
     * Unregister sagas and reducers
     */
    public componentWillUnmount(): void {
        const {
            reducerKey,
            reduxContext: {
                store
            }
        } = this.props;

        // Dispatch the unmount action, then remove the reducer
        if (reducerKey) {
            store.dispatch(DynamicProviderActionsCreator.reducerRemoved(reducerKey));
        }

        // Stop the saga
        if (this._saga) {
            this._saga.cancel()
        }
    }

    /**
     * Render a Redux provider
     */
    public render(): JSX.Element {
        return (
            <Provider store={this.props.reduxContext.store}>
                {this.props.children}
            </Provider>
        );
    }
}
