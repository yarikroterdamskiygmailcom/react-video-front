import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {withRouter} from 'react-router';
import styles from './styles.scss';
import classNames from 'classnames';

@withRouter
export default class Header extends Component {

  render() {
    const {routeObj, className} = this.props;
    return (
      <div className={classNames(styles.container, className)}>
        <div className={styles.left}>{routeObj.header.left}</div>
        <div className={styles.title}>{routeObj.header.center || routeObj.name}</div>
        <div className={styles.right}>{routeObj.header.right}</div>
      </div>
    );
  }
}
