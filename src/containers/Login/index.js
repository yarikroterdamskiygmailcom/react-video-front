import React, {Component} from 'react';
import {Input, Button} from '../../atoms';
import {withRouter} from 'react-router';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {first} from 'lodash-es';
import classNames from 'classnames';
import logo from '../../../assets/logo-transparent.png';

@withRouter
@inject('session')
@observer
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null
    };
  }

  submit = e => e.key === 'Enter' && this.login();

  setProperty = property => e => this.setState({[property]: e.target.value})

  login = () => {
    const {email, password} = this.state;
    this.props.session.login(email, password)
    .then(() => this.props.history.push('/home'))
    .catch(e => this.setState({error: e}));
  }

  formatError = e => {
    const error = e.response.data;
    return JSON.stringify(error);
  }

  render() {
    const {className} = this.props;
    const {email, password, error} = this.state;
    return (
      <div className={classNames(styles.container, className)} onKeyPress={this.submit}>
        <img className={styles.logo} src={logo} />
        <Input auth modal type="email" name="Email" value={email} onChange={this.setProperty('email')} />
        <Input auth modal type="password" name="Password" value={password} onChange={this.setProperty('password')} />
        <Button className={styles.button} onClick={this.login} text="Login" />
        {error && <div>{this.formatError(error)}</div>}
        <a href="https://userdb.vlogahead.cloud/accounts/password/reset/">Forgot password?</a>
      </div>
    );
  }
}
