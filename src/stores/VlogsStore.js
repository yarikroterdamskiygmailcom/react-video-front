import {observable} from 'mobx';
import {php} from '.';
import {sessionStore} from '..';

export class VlogsStore {

  @observable list = [];
  @observable currentVlog = null;
  @observable userPrefs = null;

  loadVlogs = () => php.get('/api/v1/vlogs')
  .then(res => {
    if(res.error) {
      sessionStore.logout();
    } else {
      this.list = res.project;
    }
  }).catch(sessionStore.logout);

}

export default VlogsStore;
