import React, {Component} from 'react';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@inject('session')
@observer
export default class Logout extends Component {

    scheduleLogout = () => setTimeout(this.props.session.logout, 3000);

    render() {
      return (
        <div className={styles.container}>
        see ya loser
          {this.scheduleLogout()}
        </div>
      );
    }
}
