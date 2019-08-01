import React, { Component } from 'react';

const styles = {
    width: '50%',
    height: 400, 
    border: "solid",
    padding: 10,
    position: "relative",

  }
let id; 
export default class Hello extends Component {
    constructor(props) {
        super(props)

        this.parentElem = React.createRef();
    }
  state = {
    dimensions: null,
  };

  handleResize() {
    let doneResizing = () => {
        console.log("handle resized called!");
        this.setState({
            dimensions: {
              width: Math.round(this.parentElem.current.getBoundingClientRect().width),
              height: Math.round(this.parentElem.current.getBoundingClientRect().height),
            },
          });
      }
      clearTimeout(id);
      id = setTimeout(doneResizing, 500);
  }

  componentDidMount() {
      debugger
    //console.log(this.parentElem)
    this.setState({
      dimensions: {
        width: this.parentElem.current.getBoundingClientRect().width,
        height: this.parentElem.current.getBoundingClientRect().height,
      },
    });

    window.addEventListener("resize", this.handleResize.bind(this));
  }

  componentDidUpdate() {
    
  }

  renderContent() {
    const { dimensions } = this.state;
    console.log(`from renderContent: ${dimensions.width} x ${dimensions.height}`);
    return (
      <div>
        width: {Math.round(dimensions.width)}
        <br />
        height: {Math.round(dimensions.width)}
      </div>
    );
  }
  handleRef(event) {
    const x = "do something with event";
  }
  render() {
    const { dimensions } = this.state;
    
    

    return (
      <div className="Hello" style={styles} ref={ this.parentElem}>
        {dimensions && this.renderContent()}
      </div>
    );
  }
}
