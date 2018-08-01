import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import styles from './styles.scss';

@inject('routing')
@observer
export default class Header extends Component {

  getCurrentRoute = path => this.props.routes.find(routeObj => path === routeObj.path)

  render() {
    const currentRoute = this.getCurrentRoute(this.props.routing.location.pathname);
    return (
      <div className={styles.container}>
        <div className={styles.left}>{currentRoute.headerLeft}</div>
        <div className={styles.title}>{currentRoute.name}</div>
        <div className={styles.right}>{currentRoute.headerRight}</div>
      </div>
    );
  }
}
