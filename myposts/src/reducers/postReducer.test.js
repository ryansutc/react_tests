import postReducer from './postReducer';
import ADD_POST from '../actions/types';
import { types } from '@babel/core';

const initialState = [
    { 
        id: 1, 
        title: "Hello World 1", 
        body: "This is the body" 
    }
]

describe('post reducer', () => {
    it('should handle ADD_POST', () => {
        debugger
        expect(
            postReducer([], {
                type: types.ADD_POST
,                payload: { 
                    id: 1, 
                    title: "hello test", 
                    body: "this is the body"
                }
            })).toEqual([
                {
                    id: 1,
                    title: false,
                    body: 0
                }
        ])
    })

})

