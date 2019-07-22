import React from 'react';
import { connect } from 'react-redux';
import Post from '../components/Post';
import { deletePost } from '../actions';

function PostList({ posts, onDelete}) {
    
    return (
        <div>
            {posts.map(post => {
                return (
                    <Post 
                        post={ post } 
                        onDelete={ onDelete} 
                        key={ post.id } 
                    />
                );
            })}
        </div>
    )
} //should this part of file be in component folder?

const mapStateToProps = state => {
    return {
        posts: state.posts
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onDelete: id => {
            dispatch(deletePost(id));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostList) //should postlist be both a component and container?