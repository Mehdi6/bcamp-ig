const ROOT_URL = "http://localhost:8080/api/";

export const AuthUrls = {
    LOGIN: `${ROOT_URL}users/login`,
    LOGOUT: `${ROOT_URL}rest-auth/logout/`,
    SIGNUP: `${ROOT_URL}users/signup`,
//    CHANGE_PASSWORD: `${ROOT_URL}rest-auth/password/change/`,
//    RESET_PASSWORD: `${ROOT_URL}rest-auth/password/reset/`,
//    RESET_PASSWORD_CONFIRM: `${ROOT_URL}rest-auth/password/reset/confirm/`,
//    USER_ACTIVATION: `${ROOT_URL}rest-auth/registration/verify-email/`,
    USER_PROFILE: `${ROOT_URL}users/profile`,
};
