import {observable} from 'mobx';
import {php} from '.';
import {vlogEditorStore} from '../';
import {history} from '../constants/routes';

export class VlogDetailsStore {

    @observable vlog = null;
    @observable title = ''
    @observable overlayActive = false;
    @observable overlayContent = null;

    setVlog = vlog => {
      this.vlog = vlog;
      this.title = vlog.title || 'Untitled';
    }

    changeTitle = e => this.title = e.target.value

    confirmDelete = render => () => {
      this.overlayActive = true;
      this.overlayContent = render;
    }

    closeOverlay = () => {
      this.overlayActive = false;
      this.overlayContent = null;
    }

    deleteVlog = () => php.post('handleproject.php', {
      action: 'del',
      project_id: this.vlog.project_id
    }).then(() => {
      vlogEditorStore.cleanup();
      history.push('/home');
    })

    saveChanges = () => php.post('handleproject.php', {
      action: 'save',
      project_id: this.vlog.project_id,
      vlog_title: this.title
    })
}

export default VlogDetailsStore;
