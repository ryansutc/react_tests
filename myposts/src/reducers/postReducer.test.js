import postReducer from './postReducer';
import { ADD_POST, DELETE_POST } from '../actions/types';
import { types } from '@babel/core';

const samplePost = {
    id: 1,
    title: "hello test",
    body: "this is the body"
  };

describe('post reducer', () => {
  it('should handle ADD_POST', () => {
    expect(
      postReducer([], { type: ADD_POST, payload: samplePost})).toEqual([
        {
          id: 1,
          title: "hello test",
          body: "this is the body"
        }
      ])
  })

  // Okay, lets make a new test for DELETE_POST
  it('should handle DELETE_POST', () => {
    // need to do something here to mock having an initial post. I just set the state to include
    // but maybe it would be better to actually run the process of creating a post?
    const initialState = [samplePost];
    let result = postReducer(initialState, { type: DELETE_POST, payload: {id: 1} });
      //result.toEqual([])
      expect(result).toEqual([])
  })

})

