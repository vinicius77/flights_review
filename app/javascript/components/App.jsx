import React from 'react';
import Airlines from '../components/Airlines.jsx';
import Airline from '../components/Airline.jsx';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route exact path="/" component={Airlines} />
          <Route exact path="/airlines/:slug" component={Airline} />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;
