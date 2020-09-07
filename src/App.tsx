import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Folder from './components/folders/Folder';

import './themes/pittystop-2020.1/theme';
import destaque from './themes/pittystop-2020.1/destaque2.png';

const App: React.StatelessComponent = () => {
  return (
    <Router>
      <header>
        <img src={destaque} alt="" />
      </header>
      <div className="app">
        <Switch>
          <Route path="/*" component={Folder} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
