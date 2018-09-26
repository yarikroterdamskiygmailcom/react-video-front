import {observable} from 'mobx';
import {php} from '.';
import encode from 'object-to-formdata';
import {sessionStore} from '../';

export class VlogsStore {

  @observable list = [];
  @observable currentVlog = null;

  loadVlogs = () => php.post('handleoverview.php', encode({
    react: true,
    action: 'load',
    SessionID: sessionStore.sessionId
  })).then(res => {
    if (res.data.error) {
      //in case our token don't work no more
      sessionStore.logout();
    } else {
      this.list = res.data.project;
    }
  });

}

export default VlogsStore;
