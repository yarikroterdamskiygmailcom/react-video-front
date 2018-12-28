import React, {Component} from 'react';
import {Switch, Route, withRouter, Redirect} from 'react-router';
import {Header, NavBar, Toolbar, Toast, Overlay} from '../../components';
import routes, {navBarRoutes} from '../../constants/routes';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@withRouter
@inject('session')
@observer
class App extends Component {

  componentWillMount() {
    if(!this.props.session.token) {
      this.props.history.replace('/');
    }
  }

  renderRoute = route => <Route
    key={route.path}
    exact
    path={route.path}
    component={() =>
      <div className={styles.route}>
        {route.header && <Header routeObj={route}/>}
        <route.component className={styles.content} {...route.props} />
        {route.navBar && <NavBar/>}
      </div>
    }
    name={route.name}
    exact
  />

  renderAllRoutes = () =>
    <Switch>
      {routes.map(this.renderRoute)}
      <Redirect to={'/not-found'} />
    </Switch>

  render() {
    return (
      <div className={styles.container}>
        {this.renderAllRoutes()}
      </div>
    );
  }
}

export default App;
