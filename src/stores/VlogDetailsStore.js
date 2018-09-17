import {observable} from 'mobx';

export class VlogDetailsStore {

    @observable vlog = null;

    setVlog = vlog => {
      this.vlog = vlog;
    }
}

export default VlogDetailsStore;
