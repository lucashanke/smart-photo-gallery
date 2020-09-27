import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Folder from './components/folders/Folder';

import './themes/pittystop-2020.1/theme';
import destaque from './themes/pittystop-2020.1/header.jpg';

declare global {
  interface Window {
      gtag: any;
  }
}

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
      <Route path="/" render={({location}) => {
        if (typeof window.gtag === 'function') {
          window.gtag('config', 'UA-5524030-6', { page_path: location.pathname });
        }
        return null;
      }} />
    </Router>
  );
}

export default App;
