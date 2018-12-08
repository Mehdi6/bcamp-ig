const ROOT_URL = "http://localhost:8080/api/";

export const AuthUrls = {
    LOGIN: `${ROOT_URL}users/login`,
    LOGOUT: `${ROOT_URL}rest-auth/logout`,
    SIGNUP: `${ROOT_URL}users/signup`,
//    CHANGE_PASSWORD: `${ROOT_URL}rest-auth/password/change/`,
//    RESET_PASSWORD: `${ROOT_URL}rest-auth/password/reset/`,
//    RESET_PASSWORD_CONFIRM: `${ROOT_URL}rest-auth/password/reset/confirm/`,
//    USER_ACTIVATION: `${ROOT_URL}rest-auth/registration/verify-email/`,
    USER_PROFILE: `${ROOT_URL}users/profile`,
};

export const PostUrls = {
    CRUD_POST: `${ROOT_URL}posts/`,
    GET_POSTS: `${ROOT_URL}posts/list`,
    LIKE_POST: `${ROOT_URL}posts/react`,
    DISLIKE_POST: `${ROOT_URL}posts/unreact`,
}

export const CommentUrls = {
    CRUD_COMMENT: `${ROOT_URL}comments/`,
    LIKE_COMMENT: `${ROOT_URL}comments/react`,
    DISLIKE_COMMENT: `${ROOT_URL}comments/unreact`,
}