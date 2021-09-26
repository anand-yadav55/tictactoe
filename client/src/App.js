import Home from './components/Home';
import Title from './components/Title';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Intermediate from './components/Intermediate';
import JoinWithCode from './components/subcomponents/JoinWithCode';
import Game from './components/Game';

function App() {
  return (
    <div className="App">
      <Title />
      <Router>
        <Switch>
          <Route exact path="/join" component={JoinWithCode} />
          <Route exact path="/start" component={Intermediate} />

          {/* <Route exact path="/game">
            <Game p1="anand" p2="anan" roomCode="122" />
          </Route> */}
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
