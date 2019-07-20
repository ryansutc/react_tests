import React, { Component } from 'react';
import CounterDisplay from './CounterDisplay';

// this is a cool library that allows for the Runtime checking of React props and making sure that
// they are correct (https://www.npmjs.com/package/prop-types)
import PropTypes from 'prop-types';

class Counter extends Component {
    constructor(props) {
        super(props);
        debugger
        this.incrementIfOdd = this.incrementIfOdd.bind(this);
    }

    incrementIfOdd() {
        if (this.props.value % 2 !== 0) {
          this.props.onIncrement()
        }
    }

    render() {
        console.log("click count: " + this.props.value)
        return (
            <div>
            <p>
                Clicked: {this.props.value} times
                {' '}
                <button onClick={this.props.onIncrement}>
                +
                </button>
                {' '}
                <button onClick={this.props.onDecrement}>
                -
                </button>
                {' '}
                <button onClick={this.incrementIfOdd}>
                Increment if odd
                </button>
                {' '}
                
            </p>
            <CounterDisplay
                count={this.props.count}
            />
            </div>
        )
    }
}


// type control of params passed:

Counter.propTypes = {
    value: PropTypes.number.isRequired,
    onIncrement: PropTypes.func.isRequired,
    onDecrement: PropTypes.func.isRequired
}

export default Counter