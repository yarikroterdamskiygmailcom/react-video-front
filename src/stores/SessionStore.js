import {observable} from 'mobx';
import {php} from '.';
import encode from 'object-to-formdata';
import {sha512} from 'js-sha512';
import {history} from '../../';

export class SessionStore {
  @observable email = ''
  @observable password = ''
  @observable rememberMe = false
  @observable error = null
  @observable sessionId = null

  changeEmail = e => this.email = e.target.value
  changePassword = e => this.password = e.target.value
  setRememberMe = value => this.rememberMe = value

  initialize = () => {
    this.sessionId = sessionStorage.getItem('token') || localStorage.getItem('token') || null;
    // this.sessionId && history.push('/home');
  }

  login = () => php.post('login.php', encode({
    action: 'login',
    api_data: {
      email: this.email,
      password: sha512(this.password),
      saveLogin: false
    }
  }),
  ).then(res => {
    const data = res.data;
    const {IsError, ErrorMessage, SessionID} = data;
    if (IsError) {
      this.error = ErrorMessage;
    } else {
      this.error = null;
      this.sessionId = SessionID;
      const storage = this.rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', SessionID);
      history.push('/home');
    }
  });

  logout = () => {
    this.sessionId = null;
    sessionStorage.removeItem('token', null);
    localStorage.removeItem('token', null);
    history.push('/');
  }

}
