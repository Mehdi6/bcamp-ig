import { AuthTypes, PostTypes, CommentTypes } from "../constants/actionTypes";

export function authReducer(state = {}, action) {
    switch(action.type) {
        case AuthTypes.LOGIN:
            return { ...state, authenticated: true, token: action.payload};
        case AuthTypes.LOGOUT:
            return { ...state, authenticated: false, token: null};
        case AuthTypes.USER_PROFILE:
            return { ...state, user: action.payload};
    }
    return state;
}

export function postReducer(state = {}, action) {
    switch(action.type) {
        case PostTypes.LIKED:
            return { ...state, liked: action.payload };
        case PostTypes.DISLIKED:
            return { ...state, disliked: action.payload };
        case PostTypes.REMOVED:
            return { ...state, post: action.payload };
        case PostTypes.EDITED:
            return { ...state, post: action.payload };
    }
    return state;
}

export function commentReducer(state = {}, action) {
    switch(action.type) {
        case CommentTypes.LIKED:
        return { ...state, liked: action.payload };
        case CommentTypes.DISLIKED:
            return { ...state, disliked: action.payload };
        case CommentTypes.REMOVED:
            return { ...state, post: action.payload };
        case CommentTypes.EDITED:
            return { ...state, post: action.payload };
     }
     return state;
}