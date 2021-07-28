import * as types from "./actionTypes";

/**
 * Call this method on thunk methods before each API calls instead of fetch method
 * Advantages:
 * 1. We don't have to pass dispatch to api calls
 * 2. We can decide when to show a spinner
 * 3. Optimistic update: Update the UI before the API call is complete
 * @returns {{type: string}}
 */
export function beginApiCall() {
    return {
        type: types.BEGIN_API_CALL
    }
}

export function apiCallErrors() {
    return {
        type: types.API_CALL_ERROR
    }
}