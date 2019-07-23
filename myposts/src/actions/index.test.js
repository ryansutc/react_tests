import {createPost, deletePost} from './index';
import * as types from './types'; 

describe('actions', () => {
    it('should create an action to create a post', () => {
        const id = 1
        const title = "Hello World";
        const body = "This is a Test Post";
        const expectedAction = {
            "payload": {
                id,
                title,
                body
            },
            type: types.ADD_POST
        }
        expect(createPost({title, body})).toEqual(expectedAction)
    })

    it('should create an action to remove a post', () => {
        const id = 1
        const expectedAction = {
            "payload": {
                "id": { id: 1 }
            },
            type: types.DELETE_POST
        }
        expect(deletePost({id})).toEqual(expectedAction)
    })
})
