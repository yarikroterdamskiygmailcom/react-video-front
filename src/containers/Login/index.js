import React, {Component} from 'react';
import {Input, Button, Toggle} from '../../atoms';
import {withRouter} from 'react-router';
import {NavLink} from 'react-router-dom';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@withRouter
@inject('session')
@observer
class Login extends Component {

  render() {
    const {
      email, password,
      changeEmail, changePassword,
      error, login
    } = this.props.session;
    return (
      <div className={styles.container}>
        <div className={styles.logo}/>
        <Input className={styles.input} nameTop fieldName="Email" value={email} onChange={changeEmail}/>
        <Input className={styles.input} nameTop fieldName="Password" type="password" value={password} onChange={changePassword}/>
        <Button onClick={login} text="Login"/>
        {error && <div>{error}</div>}
        <NavLink className={styles.link} to="/forgot-password">Forgot your password?</NavLink>
      </div>
    );
  }
}

export default Login;
