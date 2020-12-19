import React from 'react';
import Airlines from './Airlines.jsx';
import ViewAirline from './ViewAirline';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route exact path="/" component={Airlines} />
          <Route exact path="/airlines/:slug" component={ViewAirline} />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;
