import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import PrivateRoute from './containers/Utils/PrivateRoute';
import PublicRoute from './containers/Utils/PublicRoute';
import Login from './containers/LoginComponent/Login';
import Dashboard from './containers/DashboardComponent/Dashboard';
import Home from './containers/HomeComponent/Home';
import { getUser, getToken, removeUserSession, setUserSession } from './containers/Utils/Common';


function App() {
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      return;
    }

    const token = getToken();
    if (!token) {
      return;
    }

    axios.get(`http://127.0.0.1:8000/student/${user.id}`).then(response => {
      console.log('response: ', response)
      setUserSession(response.data.token, response.data.data);
      setAuthLoading(false);
    }).catch(error => {
      removeUserSession();
      setAuthLoading(false);
    });
  }, []);

  if (authLoading && getUser()) {
    return <div className="content">Checking Authentication...</div>
  }

  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <div className="header">
            <NavLink exact activeClassName="active" to="/">Home</NavLink>
            <NavLink activeClassName="active" to="/login">Login</NavLink> {/*<small>(Access without token only)</small>*/}
            <NavLink activeClassName="active" to="/dashboard">Dashboard</NavLink>{/*<small>(Access with token only)</small>*/}
          </div>
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <PublicRoute path="/login" component={Login} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;