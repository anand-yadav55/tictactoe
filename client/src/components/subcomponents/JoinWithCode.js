import { useHistory } from 'react-router-dom';

export default function JoinWithCode() {
  const history = useHistory();
  return (
    <div className="box">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          history.push('/game');
        }}
      >
        <label htmlFor="name">Enter name</label>
        <input name="name" type="text" />
        <label htmlFor="roomCode">Enter Room Code</label>
        <input name="roomCode" type="text" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
