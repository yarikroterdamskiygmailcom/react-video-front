import {observable} from 'mobx';
import {php} from '.';
import {sessionStore} from '../';

export class VlogsStore {

  @observable list = [];
  @observable currentVlog = null;

  loadVlogs = () => php.post('handleoverview.php', {
    debug: true,
    react: true,
    action: 'load',
  }).then(res => {
    this.list = res.project;
  });

}

export default VlogsStore;
