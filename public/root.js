import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, Redirect, HashRouter } from 'react-router-dom';
import Login from './components/login';
import Admin from './components/admin';
import User from './components/user';
import PersonalInfo from './components/personal_info';
import PwdModify from './components/pwd_modify';
import Auth from './components/auth';

let auth = new Auth();

class Root extends React.Component {
  render () {
    return (
      <HashRouter>
        <Switch>
          <Route exact path='/' render={(props) => {
            return <Login auth={auth} {...props} />
          }} />
          <Route path='/admin' render={(props) => {
            if (auth.isLogin) {
              return <Admin {...props} />
            } else {
              return <Redirect to='/' />
            }
          }} />
          <Route path='/user' render={(props) => {
            if (auth.isLogin) {
              return <User {...props} />
            } else {
              return <Redirect to='/' />
            }
          }} />
          <Route path='/modify' component={PwdModify} />
          <Route path='/personal' component={PersonalInfo} />
        </Switch>
      </HashRouter>
    );
  }
}
ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
