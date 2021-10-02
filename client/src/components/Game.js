import { useEffect, useState } from 'react';
import '../board.css';
import { useParams } from 'react-router';
import Loading from './Loading';

import { socket } from '../service/socket';

function createBoard(roomCode) {
  if (!socket) return <div className="empty"></div>;
  let board = [];

  function handleClick(e) {
    console.log(e.target.id);
    console.log(socket.id);
    let data = { socketID: socket.id, roomCode: roomCode, move: e.target.id };
    socket.emit('new-move', data);
  }
  for (let i = 0; i < 3; i++) {
    let children = [];
    for (let j = 0; j < 3; j++) {
      children.push(
        <span
          onClick={(e) => handleClick(e)}
          className="boardBlock"
          id={String(i) + String(j)}
        ></span>
      );
    }
    board.push(<div key={i}>{children}</div>);
  }
  return board;
}

export default function Game(props) {
  const urlParameters = useParams();
  const [playersConnected, setPlayerConnected] = useState(false);
  // const socket = io.connect();
  useEffect(() => {
    // socket = io.connect();
    socket.emit('join-room', urlParameters.roomCode);
    socket.on('event', (data) => console.log(data));
    socket.on('both-ready', (data) => {
      console.log('both', data);
      setPlayerConnected(true);
    });
    return () => socket.close();
  }, []);
  console.log('a');

  // let [socket, setSocket] = useState(null);
  // setSocket(io.connect());

  return playersConnected ? (
    <div className="main">
      <h1>Game</h1>
      <p>
        <span style={{ float: 'left' }}>{props.p1}</span>
        <span style={{ float: 'right' }}>{props.p2}</span>
      </p>
      <p>Room Code: {urlParameters.roomCode}</p>
      <div className="board">{createBoard(urlParameters.roomCode)}</div>
    </div>
  ) : (
    <Loading />
  );
}
