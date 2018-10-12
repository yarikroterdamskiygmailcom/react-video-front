import {observable} from 'mobx';
import {php} from '.';
import {sessionStore} from '..';

export class SettingsStore {

  @observable settings = {

  };

  toggle = setting => {
    console.log(setting);
    this.settings = {...this.settings, [setting]: !this.settings[setting]};
    console.log(this.settings);
  }
}

export default SettingsStore;
