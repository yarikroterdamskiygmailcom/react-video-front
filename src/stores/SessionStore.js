import {observable} from 'mobx';
import {php, userDB} from '.';
import {history} from '../constants/routes';
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
    if(this.sessionId) {
      php.interceptors.request.use(
        config => ({...config, data: {...config.data, SessionID: this.sessionId}}),
        error => error
      );
      userDB.defaults.headers.common.Authorization = `Token ${this.sessionId}`;
      history.push('/home');
    }
  }

  login = () => php.post('login.php', {
    action: 'login',
    api_data: {
      email: this.email,
      password: this.password,
      saveLogin: false
    }
  }).then(res => {
    console.log(res);
    const {access_token, error} = res;
    if (error) {
      this.error = error;
    } else {
      this.error = null;
      this.sessionId = access_token;
      try {
        localStorage.setItem('token', access_token);
      } catch(e) {
        Cookies.set('token', access_token);
      }
      this.initialize();
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
