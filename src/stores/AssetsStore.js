import {observable} from 'mobx';
import {php} from '.';
import Resumable from 'resumablejs';
import encode from 'object-to-formdata';

export class AssetsStore {

    @observable sessionId = null
    @observable assetList = []
    @observable uploading = false;

    setSessionId = sessionId => this.sessionId = sessionId;

    loadAssets = () => {
      php.post('handleproject.php', encode({
        react: true,
        action: 'loadassets',
        SessionID: this.sessionId
      })).then(res => {
        this.assetList = res.data.asset;
      });
    }

    initResumable = () => {
      this.resumable = new Resumable({
        target: 'https://intranet.sonicvoyage.nl/fileuploader/web/resumableuploader.php',
        query: {
          SessionID: this.sessionId,
          action: 'uploadasset',
          type: 'video'
        }
      });
      this.resumable.assignBrowse(document.getElementById('addAsset'));
      this.resumable.on('fileAdded', () => {
        this.resumable.upload();
        this.uploading = true;
      });
      this.resumable.on('fileSuccess', () => {
        this.uploading = false;
        this.loadAssets();
        this.resumable.cancel();
      });
    }

}

export default AssetsStore;
