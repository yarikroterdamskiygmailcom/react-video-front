import {observable, toJS} from 'mobx';
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
        debug: true,
        react: true,
        action: 'save',
        SessionID: toJS(this.sessionId),
        project_id: toJS(projectId),
        media: JSON.stringify(toJS(media))
      })).then(res => {
        console.log(projectId, res, toJS(media));
      });
    }

    toggleEmailMe = val => this.emailMe = val

    toggleAspectRatio = () => this.aspectRatio = this.aspectRatio === '16by9' ? '9by16' : '16by9'

    getPreview = () => {
      this.previewPending = true;
    }

}

export default VlogRenderStore;
