import { useParams } from 'react-router-dom';
import Home from './components/Home';

import Title from './components/Title';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import StartGame from './components/subcomponents/startGame';
import JoinWithCode from './components/subcomponents/JoinWithCode';
import Game from './components/Game';
import { socket } from './service/socket';

function App() {
  return (
    <div className="App">
      <Title />
      <Router>
        <Switch>
          <Route exact path="/join" component={JoinWithCode} />
          <Route exact path="/start" component={StartGame} />

          <Route exact path="/game/:roomCode">
            <Game
              p1="anand"
              p2="anan"
              socket={socket}
              roomCode={useParams.roomCode}
            />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
