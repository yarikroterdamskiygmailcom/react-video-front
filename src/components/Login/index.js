import React, {Component} from 'react';
import {Input, Button, Toggle} from '..';
import {NavLink} from 'react-router-dom';
import styles from './styles.scss';

class Login extends Component {

  submit = () => null

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.fields}>
            <Input fieldName="Email"/>
            <Input fieldName="Password" type="password"/>
          </div>
          <div className={styles.remember}>
          Remember login?
            <Toggle/>
          </div>
          <NavLink to="/signup">Don't have an account yet? Sign up</NavLink>
          <NavLink to="/forgotpassword">Forgot password?</NavLink>
          <Button fn={this.submit} text="Sign In"/>
        </div>
      </div>
    );
  }
}

export default Login;
