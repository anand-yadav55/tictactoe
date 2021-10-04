import { useEffect, useState } from 'react';
import '../board.css';
import { useParams } from 'react-router';
import Loading from './Loading';

import { socket } from '../service/socket';

function createBoard(roomCode, gameBoard, setGameBoard, isX) {
  if (!socket) return <div className="empty"></div>;
  let board = [];

  function handleClick(e) {
    let data = { socketID: socket.id, roomCode: roomCode, move: e.target.id };
    socket.emit('new-move', data);
    // if (gameBoard[e.target.id]) {
    //   e.target.classList.add(isX ? 'X' : 'O');
    //   e.target.classList.remove('N');
    // }
  }
  let k = 0;
  for (let i = 0; i < 3; i++) {
    let children = [];
    for (let j = 0; j < 3; j++) {
      children.push(
        <span
          key={String(i) + j}
          onClick={(e) => {
            handleClick(e);
          }}
          className={`boardBlock ${gameBoard[k]}`}
          id={k++}
        ></span>
      );
    }
    board.push(<div key={i}>{children}</div>);
  }
  return board;
}
function updateBoardOnMove(move, isX) {
  const moveBlock = document.getElementById(move);
  moveBlock.classList.add(isX ? 'X' : 'O');
  console.log(move, isX);
}

export default function Game(props) {
  const urlParameters = useParams();
  const [playersConnected, setPlayerConnected] = useState(false);
  const [result, setResult] = useState('');

  const defaultBoard = ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'];
  const [board, setBoard] = useState(defaultBoard);

  const [isX, setIsX] = useState(true);

  useEffect(() => {
    socket.emit('join-room', urlParameters.roomCode);

    socket.on('event', (data) => console.log(data));

    socket.on('result', (data) => {
      console.log(data);
      setResult(data);
    });

    socket.on('game-end', (data) => {
      console.log(data);
      socket.close();
    });

    socket.on('both-ready', (data) => {
      console.log('both-connected', data);
      setPlayerConnected(true);
    });

    socket.on('move-symbol', (data) => setIsX(data));

    socket.on('boardUpdate', (data) => {
      console.log(data);
      setBoard(data.newBoardState);
      updateBoardOnMove(data.moveIndex, data.isX);
    });

    return () => socket.close();
  }, []);

  return playersConnected ? (
    <div className="main">
      <h1>Game</h1>
      <h3>{result}</h3>
      <p>
        <span style={{ float: 'left' }}>{props.p1}</span>
        <span style={{ float: 'right' }}>{props.p2}</span>
      </p>
      <p>Room Code: {urlParameters.roomCode}</p>
      <div className="board">
        {createBoard(urlParameters.roomCode, board, setBoard, isX)}
      </div>
    </div>
  ) : (
    <Loading message="Waiting For Another Player" />
  );
}
