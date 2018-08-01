import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {NavLink} from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';
import {navBarRoutes} from '../../constants/routes';
import styles from './styles.scss';

@withRouter
@inject('routing')
@observer
export default class NavBar extends Component {

    renderRoute = ({name, icon, path}) => (
      <NavLink to={path} className={styles.route} activeClassName={styles.active}>
        <FontAwesome name={icon}/>
        {name}
      </NavLink>
    )
    render() {
      return (
        <div className={styles.container}>
          {navBarRoutes.map(this.renderRoute)}
        </div>
      );
    }
}
