import {observable} from 'mobx';
import {php} from '.';
import Resumable from 'resumablejs';
import {sessionStore} from '../';

export class AssetsStore {

  @observable assetList = []
  @observable uploading = false;

  loadAssets = () => {
    php.post('handleproject.php', {
      react: true,
      action: 'loadassets',
    }).then(res => {
      this.assetList = res.asset;
    });
  }

  deleteAsset = id =>
    php.post('handleproject.php', {
      react: true,
      action: 'deleteasset',
      id: id
    }).then(this.loadAssets);

  initResumable = () => {
    this.resumable = new Resumable({
      target: 'https://intranet.sonicvoyage.nl/fileuploader/web/resumableuploader.php',
      query: {
        SessionID: sessionStore.sessionId,
        action: 'uploadasset',
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
