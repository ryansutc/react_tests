import {ADD_POST, DELETE_POST } from './types';

let postId = 1;
export const createPost = ({title, body}) => {
    debugger
    return  ({
    
        type: ADD_POST,
        payload: {
            id: postId++,
            title,
            body
        }
    })
};

export const deletePost = id => ({
    type: DELETE_POST,
    payload: {
        id
    }
});

