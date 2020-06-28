import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import Folder from './components/folders/Folder';

const App: React.StatelessComponent = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/folder">Categorias</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/folder" exact component={Folder} />
          <Route path="/folder/*" component={Folder} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
