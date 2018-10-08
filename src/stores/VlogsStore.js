import {observable} from 'mobx';
import {php} from '.';

export class VlogsStore {

  @observable list = [];
  @observable currentVlog = null;
  @observable userPrefs = null;

  loadVlogs = () => php.post('handleoverview.php', {
    debug: true,
    react: true,
    action: 'load',
  }).then(res => {
    this.list = res.project;
    this.userPrefs = res.userprefs;
  });

}

export default VlogsStore;
