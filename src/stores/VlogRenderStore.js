import {observable} from 'mobx';
import {php} from '.';
import encode from 'object-to-formdata';

export class VlogRenderStore {

    @observable sessionId = null
    @observable emailMe = true
    @observable aspectRatio = '16by9'
    @observable previewReady = false;
    @observable previewPending = false;
    @observable preview = null;

    setSessionId = sessionId => this.sessionId = sessionId;

    saveVlog = ({projectId, media}) => {
      php.post('handleproject.php', encode({
        react: true,
        action: 'save',
        SessionID: this.sessionId,
        project_id: projectId,
        media
      })).then(res => {
        this.assetList = res.data.asset;
      });
    }

    toggleEmailMe = val => this.emailMe = val

    toggleAspectRatio = () => this.aspectRatio = this.aspectRatio === '16by9' ? '9by16' : '16by9'

    getPreview = () => {
      this.previewPending = true;
    }

}

export default VlogRenderStore;
