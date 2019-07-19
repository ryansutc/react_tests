import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';



function Square(props) {
  console.log(props)
  if (props.isWinner) {
    
    return (
      <button className="square winner" onClick={props.onClick}>
        {props.value}
      </button>
    )
  }
  if (props.isCurClick) {
    return (
      <button className="square red" onClick={props.onClick}>
        {props.value}
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
   
    const isWinner = this.props.winCells && this.props.winCells.includes(i);
    if(isWinner) debugger
    return (
      <Square 
        //className={col+"-"+row+ " "}

        value={this.props.squares[i]}
        isCurClick={i === this.props.curClick}
        loc={[col, row]}
        isWinner={isWinner}
        onClick={() => this.props.onClick(i, col, row)}
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
      curClick: -1,
      winCells: null
    };
  }

  handleClick(i, col, row) {
    console.log("handle click was run");
    console.log("square coords: " + col + "-" + row)
    
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (squares[i] || calculateWinner(current.squares)) {
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
      curClick: i, //this is the currently clicked cell
      col: col,
      row: row,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    console.log("game render was run: " + this.props.winCells);
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    
    const moves = history.map((step, move) => {
      const desc = move ?
        'move #' + move + "(" + this.state.col +"-" + this.state.row + ")" :
        'game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    let status;
    let winCells;
    const result = calculateWinner(current.squares);
    
    
    if (result) {
      status = "Winner: " + result.winner;
      winCells = result.squares;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            curClick={this.state.curClick}
            onClick={(i, col, row) => this.handleClick(i, col, row)}
            winCells={winCells}
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
      debugger
      return {"winner":squares[a], squares: [a,b,c]};
    }
  }
  return null;
}
