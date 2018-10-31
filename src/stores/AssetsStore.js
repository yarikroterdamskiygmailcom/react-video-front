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

  loadStyles = () => php.get('/api/v1/styles')
  .then(res => {
    this.styleList = !isEmpty(res.styles) ? res.styles : [];
  });

  uploadStyle = style => php.post('api/v1/styles', style)

  updateStyle = (id, style) => php.put(`api/v1/styles/${id}`, style.toJS())

  deleteStyle = id => php.delete(`/api/v1/styles/${id}`)

  loadAssets = () => php.get('/api/v1/assets')
  .then(res => {
    this.assetList = !isEmpty(res.asset) ? res.asset : [];
  });

  deleteAsset = id => php.delete(`/api/v1/assets/${id}`)

  initResumables = () => {

    const teamResumable = new Resumable({
      target: 'https://intranet.sonicvoyage.nl/fileuploader/web/resumableuploader.php',
      query: {
        SessionID: sessionStore.token,
        action: 'uploadasset',
        access: 'team'
      },
      filetype: ['mp4']
    });

    teamResumable.assignBrowse(document.getElementById('teamupload'));

    teamResumable.on('fileAdded', () => {
      teamResumable.upload();
      this.uploading = true;
    });

    teamResumable.on('fileSuccess', () => {
      this.uploading = false;
      this.loadAssets();
      teamResumable.cancel();
      this.progress = 0;
    });

    teamResumable.on('progress', () => this.progress = teamResumable.progress() * 100);

    const personalResumable = new Resumable({
      target: 'https://intranet.sonicvoyage.nl/fileuploader/web/resumableuploader.php',
      query: {
        SessionID: sessionStore.token,
        action: 'uploadasset',
        access: 'personal'
      },
      filetype: ['mp4']
    });

    personalResumable.assignBrowse(document.getElementById('personalupload'));

    personalResumable.on('fileAdded', () => {
      personalResumable.upload();
      this.uploading = true;
    });

    personalResumable.on('fileSuccess', () => {
      this.uploading = false;
      this.loadAssets();
      personalResumable.cancel();
      this.progress = 0;
    });

    personalResumable.on('progress', () => this.progress = personalResumable.progress() * 100);
  }

}

export default AssetsStore;
