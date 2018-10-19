import {observable} from 'mobx';
import {php} from '.';
import Resumable from 'resumablejs';
import {sessionStore} from '../';
import {isEmpty} from 'lodash-es';

export class AssetsStore {

  @observable assetList = []
  @observable uploading = false;
  @observable progress = 0;
  @observable styleList = [];

  loadStyles = () => php.get('/api/v1/vlogs')
  .then(res => {
    if(res.error === 'loginerror') {
      sessionStore.logout();
    } else {
      this.styleList = res.userprefs.title;
    }
  });

  loadAssets = () => php.get('/api/v1/assets')
  .then(res => {
    this.assetList = !isEmpty(res.asset) ? res.asset : [];
  });

  deleteAsset = id =>
    php.delete(`/api/v1/asset/${id}`)
    .then(this.loadAssets);

  initResumable = () => {
    this.resumable = new Resumable({
      target: 'https://intranet.sonicvoyage.nl/fileuploader/web/resumableuploader.php',
      query: {
        SessionID: sessionStore.sessionId,
        action: 'uploadasset',
      },
      filetype: ['mp4']
    });

    this.resumable.assignBrowse(document.getElementById('teamupload'));

    this.resumable.on('fileAdded', () => {
      this.resumable.upload();
      this.uploading = true;
    });

    this.resumable.on('fileSuccess', () => {
      this.uploading = false;
      this.loadAssets();
      this.resumable.cancel();
      this.progress = 0;
    });

    this.resumable.on('progress', () => this.progress = this.resumable.progress() * 100);
  }

}

export default AssetsStore;
