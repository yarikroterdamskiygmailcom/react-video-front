import {observable} from 'mobx';
import {php} from '.';
import encode from 'object-to-formdata';
import {sessionStore} from '../';
import {history} from '../constants/routes';

export class VlogDetailsStore {

    @observable vlog = null;
    @observable overlayActive = false;
    @observable overlayContent = null;

    setVlog = vlog => {
      this.vlog = vlog;
    }

    confirmDelete = render => () => {
      this.overlayActive = true;
      this.overlayContent = render;
    }

    closeOverlay = () => {
      this.overlayActive = false;
      this.overlayContent = null;
    }

    deleteVlog = () => php.post('handleproject.php', encode({
      action: 'del',
      SessionID: sessionStore.sessionId,
      project_id: this.vlog.project_id
    }),
    ).then(() => history.push('/home'))
}

export default VlogDetailsStore;
