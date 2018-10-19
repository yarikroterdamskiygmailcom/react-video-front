import {observable} from 'mobx';
import {php} from '.';
import {sessionStore} from '..';

export class VlogsStore {

  @observable list = [];
  @observable currentVlog = null;
  @observable userPrefs = null;

  loadVlogs = () => php.get('/api/v1/vlogs')
  .then(res => {
    if(res.error === 'loginerror') {
      sessionStore.logout();
    } else {
      this.list = res.project;
      this.userPrefs = res.userprefs;
    }
  });

}

export default VlogsStore;
