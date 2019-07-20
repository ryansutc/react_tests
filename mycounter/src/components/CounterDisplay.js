// New: Ryan's added child component

import React, { Component } from 'react';

function CounterDisplay(props) {
    return (<p>Button was clicked {props.count} times</p>);

}

export default CounterDisplay