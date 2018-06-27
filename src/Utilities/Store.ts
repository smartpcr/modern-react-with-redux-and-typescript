
import {
    AnyAction,
    applyMiddleware,
    combineReducers,
    compose,
    createStore,
    Reducer,
    ReducersMapObject,
    Store
} from "redux";

import {
    default as createSagaMiddleware,
    SagaMiddleware
} from "redux-saga";
import { DynamicProviderActionsCreator } from './DynamicProviderActions';

export interface IWebPageContext {}


/**
 * DynamicStore is an extension of the Redux Store which adds the addReducer and removeReducer functions
 */
export type DynamicStore<S> = Store<S> & {
    /**
     * Add a new reducer with the given state key to the store
     * @param key The key that should be added to the state object
     * @param reducer The reducer to add
     */
    addReducer: <T>(key: string, reducer: Reducer<T>) => void;

    /**
     * Remove a reducer with the given key
     * @param key The key that should be removed
     */
    removeReducer: (key: string) => void;
};

/**
 * The redux context
 */
export interface IReduxContext<S> {
    /**
     * The redux store
     */
    store: DynamicStore<S>;

    /**
     * The saga middleware that is linked to the store
     */
    sagaMiddleware: SagaMiddleware<ISagaContext>;
}

/**
 * The context to be passed to all sagas
 */
export interface ISagaContext {
    /**
     * The current VSS Page context
     */
    pageContext: IWebPageContext;
}

/**
 * Configure a store to which additional reducers can be registered and unregistered
 * This function will also configure the Saga Middleware for later use
 * @param staticReducers The static reducers, which should always be present on the store
 * @param preloadedState Any initial state to set
 * @param pageContext The IVSSPageContext
 * @returns A redux context object, which contains the store and the saga middleware
 */
export function configureDynamicStore<S>(staticReducers: ReducersMapObject<S>, preloadedState: S, pageContext: IWebPageContext): IReduxContext<S> {
    const sagaMiddleware = createSagaMiddleware<ISagaContext>({
        context: {
            pageContext
        }
    });

    const reducerFunctions = combineDynamicReducers(staticReducers)

    const composeEnhancers = compose;
    const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));

    const store = createStore<S, any, {}, {}>(
        reducerFunctions.reducer,
        preloadedState as any,
        enhancer
    );

    const dynamicStore = store as DynamicStore<S>;
    dynamicStore.addReducer = (key: string, reducer: Reducer<any>) => {
        reducerFunctions.addReducer(key, reducer);
        dynamicStore.dispatch(DynamicProviderActionsCreator.reducerAdded(key));
    };

    dynamicStore.removeReducer = (key: string) => {
        dynamicStore.dispatch(DynamicProviderActionsCreator.reducerRemoved(key));
        reducerFunctions.removeReducer(key);
    };

    return {
        store: dynamicStore,
        sagaMiddleware
    };
}

/**
 * Create a combined reducer as in the fashion of Redux's combineReducers() function,
 * but allows for the dynamic registration of additional reducers
 * @param staticReducers The reducers that should always be registered with the store.
 * @returns An object with three functions: the reducer, an addReducer function, and a removeReducer function
 */
function combineDynamicReducers<S extends {}>(staticReducers: ReducersMapObject<S>) {
    let rm: ReducersMapObject<S> = { ...(staticReducers as object) } as ReducersMapObject<S>;
    let combinedReducer = combineReducers(staticReducers);

    const dynamicReducers: ReducersMapObject<any> = {};

    return {
        reducer: (state: S, action: AnyAction) => combinedReducer(state, action),
        addReducer: (key: string, reducer: Reducer) => {
            dynamicReducers[key] = reducer;
            rm = { ...(staticReducers as object), ...dynamicReducers } as ReducersMapObject<S>;
            combinedReducer = combineReducers(rm);
        },
        removeReducer: (key: string) => {
            delete dynamicReducers[key];
            rm = { ...(staticReducers as object), ...dynamicReducers } as ReducersMapObject<S>;
            combinedReducer = combineReducers(rm);
        }
    }
}
