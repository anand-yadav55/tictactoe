import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import '../board.css';
import { useParams } from 'react-router';
import Loading from './Loading';

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
  const urlParameters = useParams();
  const [playersConnected, setPlayerConnected] = useState(false);

  useEffect(() => {
    const socket = io.connect();
    socket.emit('join-room', urlParameters.roomCode);
    socket.on('event', (data) => console.log(data));
    socket.on('both-ready', (data) => {
      console.log('both', data);
      setPlayerConnected(true);
    });
    return () => socket.close();
  }, []);

  return playersConnected ? (
    <div className="main">
      <h1>Game</h1>
      <p>
        <span style={{ float: 'left' }}>{props.p1}</span>
        <span style={{ float: 'right' }}>{props.p2}</span>
      </p>
      <p>Room Code: {urlParameters.roomCode}</p>
      <div className="board">
        <table>{createBoard()}</table>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
