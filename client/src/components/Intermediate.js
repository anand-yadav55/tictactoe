import { Route, Switch, useHistory } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Game from './Game';

export default function PlayerDetailModel() {
  const history = useHistory();
  return (
    <div className="box">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          history.push('/game');
        }}
      >
        <Switch>
          <Route exact path="/game">
            <Game p1="anand" p2="anan" roomCode="122" />
          </Route>
        </Switch>
        <label htmlFor="playerName">Your Name</label>
        <input name="playerName" type="text" />
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
