import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import styles from './styles.scss';
import {Input, Button} from '../../atoms';
import {observer, inject} from 'mobx-react';

@inject('session')
@inject('profile')
@observer
export default class Profile extends Component {

  render() {
    const {firstName, lastName, changeFirstName, changeLastName} = this.props.profile;
    return (
      <div className={styles.container}>
        <Input fieldName="First Name" nameTop value={firstName} onChange={changeFirstName}/>
        <Input fieldName="Last Name" nameTop value={lastName} onChange={changeLastName}/>
        <NavLink to="/assets">My Assets</NavLink>
        <Button text={'LOGOUT'} onClick={this.props.session.logout}/>
      </div>
    );
  }
}
