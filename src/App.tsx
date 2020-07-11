import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Folder from './components/folders/Folder';
import Photo from './components/folders/Photo';

const App: React.StatelessComponent = () => {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/folder" exact component={Folder} />
          <Route path="/photo/*" component={Photo} />
          <Route path="/folder/*" component={Folder} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
