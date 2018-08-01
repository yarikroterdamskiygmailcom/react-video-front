import React, {Component} from 'react';
import {Switch, Route, withRouter} from 'react-router';
import {Header, NavBar, NotFound} from '..';
import routes, {navBarRoutes} from '../../constants/routes';
import styles from './styles.scss';

@withRouter
class App extends Component {

    renderRoute = route => {
      console.log(route.path);
      return <Route key={route.path} exact={true} path={route.path} component={route.component} name={route.name}/>;
    }

    render() {
      return (
        <div className={styles.container}>
          <Header routes={routes}/>
          <div className={styles.content}>
            {routes.map(this.renderRoute)}
            <Route component={NotFound}/>
          </div>
          <NavBar routes={navBarRoutes}/>
        </div>
      );
    }
}

export default App;
