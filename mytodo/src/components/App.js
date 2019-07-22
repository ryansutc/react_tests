import React from 'react';
import AddTodo from '../containers/AddTodo';
import TodoList from './TodoList';
import VisibleTodoList from '../containers/VisibleTodoList'
import Footer from './Footer'
import GetSummaryCount from '../containers/GetSummaryCount';

export default function App() {
  return (
    <div className="App">
      <h1>Todo List</h1>
      <AddTodo />
      <VisibleTodoList
      />
      <Footer />
      <GetSummaryCount />
    </div>
  );
}
