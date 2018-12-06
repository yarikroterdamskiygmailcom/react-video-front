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

  submit = e => e.key === 'Enter' && this.props.session.login()

  render() {
    const {
      email, password,
      changeEmail, changePassword,
      error, login
    } = this.props.session;
    return (
      <div className={styles.container} onKeyPress={this.submit}>
        <div className={styles.logo}/>
        <Input auth modal type="email" name="Email" value={email} onChange={changeEmail}/>
        <Input auth modal type="password" name="Password" value={password} onChange={changePassword}/>
        <Button className={styles.button} onClick={login} text="Login"/>
        {error && <div>{error}</div>}
        <a href="https://userdb.vlogahead.cloud/accounts/password/reset/">Forgot password?</a>
      </div>
    );
  }
}

export default Login;
