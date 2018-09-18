import React, {Component} from 'react';
import {Switch, Route, withRouter, Redirect} from 'react-router';
import {Header, NavBar, Toolbar} from '../../components';
import routes, {navBarRoutes} from '../../constants/routes';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@withRouter
@inject('session')
@observer
class App extends Component {

  renderRoute = route => route.redirect || <Route key={route.path} exact path={route.path} component={route.component} name={route.name} exact />

  renderAllRoutes = () =>
    <Switch>
      {routes.map(this.renderRoute)}
      <Redirect to={'/not-found'}/>
    </Switch>

  render() {
    const authenticated = this.props.session.sessionId;
    const currentRouteObj = routes.find(routeObj => routeObj.path === this.props.location.pathname) || {};
    return (
      <div className={styles.container}>
        {currentRouteObj.header && <Header routeObj={currentRouteObj} />}
        <div className={styles.content}>
          {!authenticated && <Redirect to="/"/>}
          {this.renderAllRoutes()}
        </div>
        <div className={styles.bottom}>
          {currentRouteObj.toolbar && <Toolbar />}
          {currentRouteObj.navBar && <NavBar routes={navBarRoutes} />}
        </div>
      </div>
    );
  }
}

export default App;
