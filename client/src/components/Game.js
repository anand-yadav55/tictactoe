import io from 'socket.io-client';
import { useEffect } from 'react';
import '../board.css';

function createBoard() {
  let table = [];

  for (let i = 0; i < 3; i++) {
    let children = [];
    for (let j = 0; j < 3; j++) {
      children.push(<td></td>);
    }
    table.push(<tr>{children}</tr>);
  }
  return table;
}

export default function Game(props) {
  useEffect(() => {
    const socket = io.connect();
  }, []);

  return (
    <div className="main">
      <h1>Game</h1>
      <p>
        <span style={{ float: 'left' }}>{props.p1}</span>
        <span style={{ float: 'right' }}>{props.p2}</span>
      </p>
      <p>Room Code: {props.roomCode}</p>
      <div className="board">
        <table>{createBoard()}</table>
      </div>
    </div>
  );
}
