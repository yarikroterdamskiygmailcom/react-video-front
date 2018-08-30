import {observable} from 'mobx';
import {php} from '.';
import encode from 'object-to-formdata';

export class VlogsStore {

    @observable list = [];
    @observable currentVlog = null;

      loadVlogs = sessionId => {
        php.post('handleoverview.php', encode({
          react: true,
          action: 'load',
          SessionID: sessionId
        })).then(res => {
          this.list = res.data.project;
        });
      }
}

export default VlogsStore;
