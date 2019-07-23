import {ADD_POST, DELETE_POST } from './types';

let postId = 1;
export const createPost = ({title, body}) => {
    return  ({
    
        type: ADD_POST,
        payload: {
            id: postId++,
            title,
            body
        }
    })
};

export const deletePost = id => {
    return ({
        type: DELETE_POST,
        payload: {
            id
        }
    });
}

