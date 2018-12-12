import axios from "axios";

import { PostUrls } from "../constants/urls";
import { PostTypes } from "../constants/actionTypes";
import store from "../store";
import { getUserToken } from "../utils/authUtils";


export function setPost(payload) {
    return {
        type: PostTypes.POSTS,
        payload: payload
    };
}

export function getPosts() {
    return function(dispatch) {
        let url = PostUrls.GET_POSTS;
        
        const token = getUserToken(store.getState());
        
        if (token) {
            axios.get(url, {
                headers: {
                    authorization: 'Token ' + token
                }
            }).then(response => {
                dispatch(setPost(response.data));
            }).catch((error) => {
                // If request is bad...
                // Show an error to the user
                //console.log(error);
                // TODO: send notification and redirect
            });
        }
    };
}

export function setLiked(payload) {
    return {
        type: PostTypes.LIKED,
        payload: payload
    };
}

export function likePost(post_id) {
    return function(dispatch) {
        const token = getUserToken(store.getState());
        if (token) {
            let url = PostUrls.LIKE_POST;
            axios.post(url, {reaction : { postId: post_id, type: 'like' }}, {
                headers: {
                    authorization: 'Token ' + token
                }
            }).then(response => {
                dispatch(setLiked(post_id));                
            }).catch((error) => {
                // If request is bad...
                // Show an error to the user
                //console.log(error);
                // TODO: send notification and redirect
                //dispatch(setLiked(false));
            });
        }
    };
}

export function setDisliked(payload) {
    return {
        type: PostTypes.DISLIKED,
        payload: payload
    };
}

export function dislikePost(post_id) {
    return function(dispatch) {
        let url = "";
        let method = "";
        method = 'post';
        url = PostUrls.DISLIKE_POST;
        
        const token = getUserToken(store.getState());
        if (token) {
            axios({ method: method, 
                    url: url,
                    headers: {
                        authorization: 'Token ' + token
                    },
                    data:{ postId: post_id }
            }).then(response => {
                dispatch(setDisliked(post_id));
                //console.log(response.data);
                
            }).catch((error) => {
                // If request is bad...
                // Show an error to the user
                //console.log(error);
                // TODO: send notification and redirect
                //dispatch(setDisliked(false));
            });
        }
    };
}