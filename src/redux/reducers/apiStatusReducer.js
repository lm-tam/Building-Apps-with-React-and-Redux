import initialState from "./initialState";
import * as types from "../actions/actionTypes";

/*
Trick by Dan Abramov - creator of Redux
Our thunks dispatch an action types that end with _SUCCESS
 */
function actionTypeEndsInSuccess(type) {
    return type.substring(type.length - 8) === "_SUCCESS";
}

/**
 * Handling same action type in multiple reducers
 * @param state Number of api call in progressing
 * @param action BEGIN_API_CALL
 * @returns {number} ACTUAL API call in  progressing
 */
export default function apiStatusReducer(
    state = initialState.apiCallsInProgress,
    action
) {
    if (action.type == types.BEGIN_API_CALL) {
        return state + 1;
    } else if (action.type === types.API_CALL_ERROR || actionTypeEndsInSuccess(action.type)) {
        return state - 1;
    }
    return state;
}