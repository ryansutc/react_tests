import postReducer from './postReducer';
import { ADD_POST } from '../actions/types';
import { types } from '@babel/core';

describe('post reducer', () => {
  it('should handle ADD_POST', () => {
    expect(
      postReducer([], {
        type: ADD_POST
        , payload: {
          id: 1,
          title: "hello test",
          body: "this is the body"
        }
      })).toEqual([
        {
          id: 1,
          title: "hello test",
          body: "this is the body"
        }
      ])
  })

})

