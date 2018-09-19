import {observable} from 'mobx';
import {php} from '.';
import encode from 'object-to-formdata';
import {sha512} from 'js-sha512';
import {history} from '../';
import Cookies from 'js-cookie';

export class SessionStore {
  @observable email = ''
  @observable password = ''
  @observable error = null
  @observable sessionId = null

  changeEmail = e => this.email = e.target.value
  changePassword = e => this.password = e.target.value

  initialize = () => {
    this.sessionId = localStorage.getItem('token') || Cookies.get('token') || null;
    this.sessionId && history.push('/home');
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
      try {
        localStorage.setItem('token', SessionID);
      } catch(e) {
        Cookies.set('token', SessionID);
      }
      history.push('/home');
    }
  });

  logout = () => {
    this.sessionId = null;
    try {
      localStorage.removeItem('token', null);
    } catch(e) {
      Cookies.remove('token');
    }

    history.push('/');
  }

}
