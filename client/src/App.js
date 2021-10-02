import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Home from './components/Home';

import Title from './components/Title';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import StartGame from './components/subcomponents/startGame';
import JoinWithCode from './components/subcomponents/JoinWithCode';
import Game from './components/Game';
import Loading from './components/Loading';

function App() {
  // const [waiting, setWaiting] = useState(false);
  // useEffect(() => {
  //   setWaiting(false);
  // }, []);

  return (
    <div className="App">
      <Title />
      {/* {waiting ? ( */}
      {/* <Loading message="PLEASE WAIT" /> */}
      {/* ) : ( */}
      <Router>
        <Switch>
          <Route exact path="/join" component={JoinWithCode} />
          <Route exact path="/start" component={StartGame} />

          <Route exact path="/game/:roomCode">
            <Game p1="anand" p2="anan" roomCode={useParams.roomCode} />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
      ){/* } */}
    </div>
  );
}

export default App;
