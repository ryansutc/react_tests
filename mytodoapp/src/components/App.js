import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import Sum from './Sum'

const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
    <Sum />
  </div>
)

export default App