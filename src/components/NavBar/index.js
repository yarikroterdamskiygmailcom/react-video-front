import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {NavLink} from 'react-router-dom';
import {Icon} from '../../atoms';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';
import styles from './styles.scss';

@withRouter
@observer
export default class NavBar extends Component {

    renderRoute = ({name, icon, path}) => (
      <NavLink key={path} to={path} className={styles.route} activeClassName={styles.active}>
        <Icon className={styles.icon} name={icon}/>
        {name}
      </NavLink>
    )
    render() {
      return (
        <div className={styles.container}>
          {this.props.routes.map(this.renderRoute)}
        </div>
      );
    }
}
