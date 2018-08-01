import React, {Component} from 'react';
import {Switch, Route} from 'react-router';
import {Header, NavBar, NotFound} from '..';
import routes from '../../constants/routes';
import styles from './styles.scss';

class App extends Component {

    renderRoute = route => {
      console.log(route.path);
      return <Route key={route.path} exact={true} path={route.path} component={route.component} name={route.name}/>;

}

    render() {
      return (
        <div className={styles.container}>
          <Header/>
          {routes.map(this.renderRoute)}
          <Route component={NotFound}/>
          <NavBar/>
        </div>
      );
    }
}

export default App;
