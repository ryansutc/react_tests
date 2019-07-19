import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';



function Square(props) {

  if (props.isCurClick) {
    return (
      <button className="square red" onClick={props.onClick}>
        <b><i>{props.value} </i></b>
      </button>
    );
  }
  else {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

}

class Board extends React.Component {

  renderSquare(i, col, row) {
    return (
      <Square
        value={this.props.squares[i]}
        isCurClick={i == this.props.curClick}
        loc={[col, row]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    console.log("Board says: " + this.props.curClick + this.props.value)
    return (
      <div>

        <div className="board-row">
          <div className="square nolines">#</div>
          <div className="square nolines">1</div>
          <div className="square nolines">2</div>
          <div className="square nolines">3</div>
        </div>
        <div className="board-row">
          <div className="square nolines">1</div>
          {this.renderSquare(0, 1, 1)}
          {this.renderSquare(1, 1, 2)}
          {this.renderSquare(2, 1, 3)}
        </div>
        <div className="board-row">
          <div className="square nolines">2</div>
          {this.renderSquare(3, 2, 1)}
          {this.renderSquare(4, 2, 2)}
          {this.renderSquare(5, 2, 3)}
        </div>
        <div className="board-row">
          <div className="square nolines">3</div>
          {this.renderSquare(6, 3, 1)}
          {this.renderSquare(7, 3, 2)}
          {this.renderSquare(8, 3, 3)}
        </div>
      </div >
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      curClick: -1
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      curClick: i //this is the currently clicked cell
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'move #' + move + "(" + 1 + ")" :
        'game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            curClick={this.state.curClick}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
