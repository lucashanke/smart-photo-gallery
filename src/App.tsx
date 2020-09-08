import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Folder from './components/folders/Folder';

import './themes/pittystop-2020.1/theme';
import destaque from './themes/pittystop-2020.1/header.jpg';

const App: React.StatelessComponent = () => {
  return (
    <Router>
      <header>
        <img src={destaque} alt="" />
        <div className="overlay"></div>
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
