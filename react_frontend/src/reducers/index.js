import {combineReducers} from "redux";
import { reducer as formReducer } from "redux-form";
import { reducer as notifReducer } from 'redux-notifications';

import { authReducer, postReducer, commentReducer } from "./appReducers";

const rootReducer = combineReducers({
    form: formReducer,
    notifs: notifReducer,
    auth: authReducer,
    post: postReducer,
    comment: commentReducer,
});

export default rootReducer;