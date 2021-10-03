import { useHistory } from 'react-router';
import axios from 'axios';

export default function StartGame() {
  const history = useHistory();
  return (
    <div className="box">
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
    </div>
  );
}
