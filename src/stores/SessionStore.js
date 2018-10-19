import {observable} from 'mobx';
import {php, userDB} from '.';
import {history} from '../constants/routes';
import Cookies from 'js-cookie';

export class SessionStore {
  @observable email = ''
  @observable password = ''
  @observable error = null
  @observable token = null

  changeEmail = e => this.email = e.target.value
  changePassword = e => this.password = e.target.value

  showError = text => {
    this.error = text;
    setTimeout(() => this.error = null, 5000);
  }

  initialize = () => {
    this.token = localStorage.getItem('token') || Cookies.get('token') || null;
    if(this.token) {
      php.interceptors.request.use(
        config => ({...config, headers: {Authorization: `Token ${this.token}`}}),
        error => error
      );
      userDB.defaults.headers.common.Authorization = `Token ${this.token}`;
      history.push('/home');
    }
  }

  login = () => php.post('/api/v1/login', {
    email: this.email,
    password: this.password,
    saveLogin: false
  }).then(res => {
    const {access_token, error} = res;
    if (error) {
      this.error = error;
    } else {
      this.error = null;
      this.token = access_token;
      try {
        localStorage.setItem('token', access_token);
      } catch(e) {
        Cookies.set('token', access_token);
      }
      this.initialize();
    }
  });

  logout = () => {
    this.token = null;
    try {
      localStorage.removeItem('token', null);
    } catch(e) {
      Cookies.remove('token');
    }

    history.push('/');
  }

}
