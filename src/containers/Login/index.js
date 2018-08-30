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
      email, password, rememberMe,
      changeEmail, changePassword, setRememberMe,
      error, login
    } = this.props.session;
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.logo}/>
          <div className={styles.fields}>
            <Input fieldName="Email" value={email} onChange={changeEmail}/>
            <Input fieldName="Password" type="password" value={password} onChange={changePassword}/>
          </div>
          <div className={styles.remember}>
          Remember login?
            <Toggle value={rememberMe} onChange={setRememberMe}/>
          </div>
          <NavLink to="/forgot-password">Forgot password?</NavLink>
          <Button onClick={login} text="Sign In"/>
          {error && <div>{error}</div>}
        </div>
      </div>
    );
  }
}

export default Login;
