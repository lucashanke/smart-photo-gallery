import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Folder from './components/folders/Folder';

import './themes/pittystop/theme';

const App: React.StatelessComponent = () => {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/*" component={Folder} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
