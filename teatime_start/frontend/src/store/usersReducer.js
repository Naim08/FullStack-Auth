// ACTION TYPES

import { csrfFetch } from "./csrf";

const RECEIVE_USER = 'users/RECEIVE_USER';
const REMOVE_USER = 'users/REMOVE_USER';

// ACTION CREATORS 

export const receiveUser = user => {
    debugger
    return {
        type: RECEIVE_USER,
        playload: user
    }
}

export const removeUser = userId => {
    return {
        type: REMOVE_USER,
        userId // userId: userId
    }
}

// THUNK ACTION CREATORS
export const loginUser = user => async dispatch => {
    let res = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify(user)
    })

    let data = await res.json()
    sessionStorage.setItem('currentUser', JSON.stringify(data.user))

    dispatch(receiveUser(data.user))

}

export const logoutUser = userId => async dispatch => {
    let res = await csrfFetch('/api/session', {
        method: 'DELETE'
    })

    sessionStorage.setItem('currentUser', null)

    dispatch(removeUser(userId))
}

export const createUser = user => async dispatch => {
    debugger
    let res = await csrfFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(user)
    })

    let data = await res.json();
    debugger
    sessionStorage.setItem('currentUser', JSON.stringify(data.user))

    dispatch(receiveUser(data.user))

}

// REDUCER 

const usersReducer = ( state = {}, action) => {
    const nextState = { ...state }

    switch(action.type) {
        case RECEIVE_USER:
            debugger
            nextState[action.playload.id] = action.playload
            return nextState
        case REMOVE_USER:
            delete nextState[action.userId]
            return nextState
        default:
            return state
    }
}

export default usersReducer;