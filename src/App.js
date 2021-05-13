import routes from './routes';
import { lazy, Suspense} from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import GlobalStyles from "./globalStyles";
import "antd/dist/antd.css";
import Footer from './components/Footer';


function App() {
  return (
    <div className="App">
      <Suspense fallback={null}>
        <GlobalStyles/>
        <Router>
          <Switch>
            {routes.map((routeItem) => {
              return (
                <Route
                  key={routeItem.component}
                  path={routeItem.path}
                  exact={routeItem.exact || false}
                  component={lazy(() => import(`./pages/${routeItem.component}`))}
                />
              );
            })}
            <Redirect to='/'></Redirect>
          </Switch>
        </Router>
      </Suspense>
    </div>
  );
}

export default App;
