import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import Game from '../Game';

export default function StartGame() {
  const history = useHistory();
  // const [startGameLaod, setStartGameLoad] = useState(false);
  // useEffect(() => {}, []);
  return (
    <div className="box">
      {/* {startGameLaod ? (
        <Game />
      ) : ( */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          let data = {
            playerName: e.target.playerName.value,
          };
          // setStartGameLoad(true);
          axios.post('/api/createRoom', data).then((data) => {
            console.log(data.data.roomCode);
            const roomCode = data.data.roomCode;
            // setStartGameLoad(false);
            history.push(`/game/${roomCode}`);
          });
        }}
      >
        <label htmlFor="playerName">Your Name</label>
        <input name="playerName" type="text" />
        <button type="submit">submit</button>
      </form>
      {/* } */}
    </div>
  );
}
