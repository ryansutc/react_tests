import React from 'react';

class NewPost extends React.Component {
    state = {
        title: '',
        body: ''
    };

    // our onChange event handler. Needed for React:
    // further reading here: https://medium.com/capital-one-tech/how-to-work-with-forms-inputs-and-events-in-react-c337171b923b
    handleInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        }); //Note to self: setState allows component to control its own state, but does not involve redux in any way.
    };

    handleSubmit = (e) => {
        e.preventDefault();
        
        if (this.state.title.trim() && this.state.body.trim()) {
            console.log(this.state);
            this.props.onAddPost({title: this.state.title, body: this.state.body}); // here we call the onAddPost property (a function) which will send the new state info to Redux state container via an action.
            this.handleReset();
        }
    }

    handleReset = () => {
        this.setState({
            title: '',
            body: ''
        });
    };

    render() {
        return (
            <div data-testid="form1">
                <form onSubmit={this.handleSubmit }>
                    <div className="form-group">
                        <input 
                            type="text" 
                            placeholder="title" 
                            className="form-control" 
                            name="title"
                            onChange={ this.handleInputChange }
                            value={ this.state.title }
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            cols="15" rows="8" placeholder="Body" className="form-control" 
                            name="body"
                            onChange={ this.handleInputChange }
                            value={ this.state.body} >
                        </textarea>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">Add Post</button>
                        <button type="button" className="btn btn-warning" onClick={ this.handleReset }>Reset</button>
                    </div>
                </form>
          </div>
        )
    }
}

export default NewPost;