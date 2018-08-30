import {observable} from 'mobx';

export class VlogRenderStore {

    @observable emailMe = true
    @observable aspectRatio = '16by9'
    @observable previewReady = false;
    @observable previewPending = false;
    @observable preview = null;

    toggleEmailMe = val => this.emailMe = val

    toggleAspectRatio = () => this.aspectRatio = this.aspectRatio === '16by9' ? '9by16' : '16by9'

    getPreview = () => {
      this.previewPending = true;
    }

}

export default VlogRenderStore;
