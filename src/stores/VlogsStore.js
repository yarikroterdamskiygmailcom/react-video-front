import {observable} from 'mobx';
import {php} from '.';
import encode from 'object-to-formdata';
import {sessionStore} from '../../index';

export class VlogsStore {

    @observable list = [];
    @observable currentVlog = null;

      loadVlogs = () => {
        php.post('handleoverview.php', encode({
          react: true,
          action: 'load',
          SessionID: sessionStore.sessionId
        })).then(res => {
          this.list = res.data.project;
        });
      }
}

export default VlogsStore;
