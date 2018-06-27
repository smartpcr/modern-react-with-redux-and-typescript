import { createAction, ActionsUnion } from './ActionHelper';

export const DynamicProviderActionsCreator = {
    reducerAdded: (key: string) => createAction(DynamicProviderActionTypes.ReducerAdded, key),
    reducerRemoved: (key: string) => createAction(DynamicProviderActionTypes.ReducerRemoved, key)
}

export const enum DynamicProviderActionTypes {
    ReducerAdded = "ReducerAdded",
    ReducerRemoved = "ReducerRemoved"
}

export type DynamicActions = ActionsUnion<typeof DynamicProviderActionsCreator>;
