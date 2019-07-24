import React from 'react';

// this is just a dummy function component. It doesn't respond or listen for anything...
function Post(props) {
    debugger
    return (
        <div className="Post" id= { "post" + props.post.id}>
            <h2>{props.post.title}</h2>
            <div>{props.post.body}</div>
            <button className="btn btn-danger" type="button" onClick={() => props.onDelete(props.post.id)}>
        Remove
      </button>
        </div>
    )
}

export default Post;