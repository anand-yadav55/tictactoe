import {
  useHistory,
  //  Redirect
} from 'react-router-dom';
import axios from 'axios';

export default function JoinWithCode() {
  const history = useHistory();
  function handleSubmit(e) {
    e.preventDefault();
    let data = {
      playerName: e.target.name.value,
      roomCode: e.target.roomCode.value,
    };
    axios.post('/api/joinRoom', data).then((res) => {
      console.log(res.data);
      if (res.data.roomCode) {
        console.log('pushing');
        history.push(`/game/${res.data.roomCode}`);
      } else if (res.data.msg) {
        console.log(res.data.msg);
      }
    });
    // return <Redirect to="/game" />;
  }
  return (
    <div className="box">
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="name">Enter name</label>
        <input name="name" type="text" />
        <label htmlFor="roomCode">Enter Room Code</label>
        <input name="roomCode" type="text" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
