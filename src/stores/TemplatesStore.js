import {observable, action} from 'mobx';
import {php} from '.';
import Resumable from 'resumablejs';
import {sessionStore as session, vlogEditorStore as editor} from '../';

export class TemplatesStore {

  @observable templates = []
  @observable projectId = null;
  @observable activeTemplate = null
  @observable uploading = []
  @observable media = []

  setActiveTemplate = index => {
    this.activeTemplate = this.templates[index];
    this.uploading = Array(this.activeTemplate.fields.length).fill(null);
    this.media = Array(this.activeTemplate.fields.length).fill(null);
  }

  setProjectId = id => this.projectId = id

  createResumable = i => {
    const resumable = new Resumable({
      target: 'https://intranet.sonicvoyage.nl/fileuploader/web/resumableuploader.php',
      query: {
        SessionID: session.token,
        action: 'uploadvideo',
        project_id: this.projectId
      },
      filetype: ['mp4']
    });

    resumable.assignBrowse(document.getElementById(`fieldTarget-${i}`));

    resumable.on('fileAdded', () => {
      this.uploading[i] = 0;
      resumable.upload();
    });

    resumable.on('fileSuccess', (resumableFile, response) => {
      this.insertMedia(JSON.parse(response), i);
      this.uploading[i] = null;
      resumable.cancel();
    });

    resumable.on('progress', () => {
      if (resumable.progress() !== 0) {
        this.uploading[i] = resumable.progress() * 100;
      }
    });
  }

  @action insertMedia = (mediaObj, i) => {
    this.media[i] = mediaObj;
  }

  initResumables = () => {
    this.activeTemplate.fields = this.activeTemplate.fields.map((field, i) => ({...field, resumable: this.createResumable(i)}));
  }

  loadTemplates = async () => this.templates = await php.get('/api/v1/templates', {
    project_id: this.projectId,
  }).then(res => res.templates);

  next = () => {
    editor.media = this.media;
  }

  getAsset = id => php.get(`/api/v1/assets/${id}`).then(res => res.asset)

  handleAssets = () => {
    Promise.all(this.activeTemplate.fields.map(field =>
      field.type === 'asset'
        ? this.getAsset(field.asset_id)
        : null
    )).then(resolved => this.media = resolved);
  }
}

export default TemplatesStore;
