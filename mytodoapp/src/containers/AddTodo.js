import React from 'react'
import { connect } from 'react-redux'
import { addTodo, todoCounts } from '../actions'

const AddTodo = ({ dispatch }) => {
  let input

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!input.value.trim()) {
            return
          }
          dispatch(addTodo(input.value))
          // new: a new todo item should update the todo count element:
          dispatch(todoCounts())
          input.value = ''
        }}
      >
        
        <input ref={node => (input = node)} />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  )
}

export default connect()(AddTodo)