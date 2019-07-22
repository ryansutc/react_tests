import React from 'react';

import CreatePost from '../containers/CreatePost';
import './App.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import PostList from '../containers/PostList';

function App() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <CreatePost />
        </div>
        <div className="col-md-4">
          <PostList />
        </div>
      </div>
    </div>
  );
}

export default App;
