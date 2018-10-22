import {observable} from 'mobx';
import {php} from '.';
import {vlogEditorStore} from '../';
import {history} from '../constants/routes';

export class VlogDetailsStore {

    @observable vlog = null;
    @observable title = ''
    @observable access = null
    @observable overlayActive = false;
    @observable overlayContent = null;

    setVlog = vlog => {
      this.vlog = vlog;
      this.title = vlog.title;
      this.access = vlog.access;
    }

    changeTitle = e => this.title = e.target.value

    toggleAccess = () => this.access = 'team'

    confirmDelete = render => () => {
      this.overlayActive = true;
      this.overlayContent = render;
    }

    closeOverlay = () => {
      this.overlayActive = false;
      this.overlayContent = null;
    }

    deleteVlog = () => php.delete(`/api/v1/vlog/${this.vlog.project_id}`)
    .then(() => {
      vlogEditorStore.cleanup();
      history.push('/home');
    })

    saveChanges = changes => php.put(`/api/v1/vlog/${this.vlog.project_id}`, {...changes})
}

export default VlogDetailsStore;
