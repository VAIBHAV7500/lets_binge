import Home from './components/home';
import Room from './components/Room'; 

import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/room" component={Room}/>
          <Redirect to='/'></Redirect>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
