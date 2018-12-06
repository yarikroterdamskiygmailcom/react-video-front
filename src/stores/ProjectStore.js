import {observable} from 'mobx';
import {php} from '.';
import {vlogEditorStore as editor, templatesStore as templates} from '../';
import {pick} from 'lodash-es';

export class ProjectStore {

    @observable projectId = null;
    @observable title = null;
    @observable description = null;
    @observable access = null;
    @observable status = null;
    @observable filter = null;
    @observable logoOverlay = null;
    @observable customSubs = null;
    @observable customEdit = null;
    @observable exportUrl = null;

    setProperty = (property, value) => this[property] = value;

    toggleProperty = property => this[property] = !this[property]

    clearProject = () => {
      this.projectId = null;
      this.title = null;
      this.description = null;
      this.access = null;
      this.status = null;
      this.filter = null;
      this.logoOverlay = null;
      this.customSubs = null;
      this.customEdit = null;
      this.exportUrl = null;

      editor.setMedia([]);
      editor.setProjectId(null);
    }

    setProject = project => {
      this.projectId = project.project_id;
      this.title = project.title;
      this.description = project.description;
      this.access = project.access;
      this.status = project.status;
      this.filter = project.filter;
      this.logoOverlay = project.watermark;
      this.customSubs = project.custom_subs;
      this.customEdit = project.custom_edit;
      this.exportUrl = project.exporturl;

      editor.setMedia(project.video);
      editor.setProjectId(this.projectId);
    }

    startFromScratch = async () => {
      this.projectId = await php.get('/api/v1/vlog/new').then(res => res.project_id);
      this.title = '';
      this.description = '';
      this.access = 'personal';
      this.status = 'saved';
      this.filter = null;
      this.logoOverlay = false;
      this.customSubs = false;
      this.customEdit = false;
      this.exportUrl = null;

      editor.setMedia([]);
      editor.setProjectId(this.projectId);
    }

    startProfessional = async () => {
      this.projectId = await php.get('/api/v1/vlog/new').then(res => res.project_id);
      this.title = '';
      this.description = '';
      this.access = 'personal';
      this.status = 'saved';
      this.filter = null;
      this.logoOverlay = false;
      this.customSubs = false;
      this.customEdit = true;
      this.exportUrl = null;

      editor.setMedia([]);
      editor.setProjectId(this.projectId);
    }

    startFromTemplate = async i => {
      await this.startFromScratch();
      templates.setActiveTemplate(i);
      templates.setProjectId(this.projectId);
    }

    generateOptions = () => JSON.stringify({
      watermark: this.logoOverlay,
      subtitles: this.customSubs,
      customedit: this.customEdit,
      filter: this.filter || undefined
    });

    saveProject = () => php.post(`/api/v1/vlog/${this.projectId}`, {
      title: this.title,
      description: this.description,
      access: this.access,
      options: this.generateOptions(),
      media: JSON.stringify(editor.media.toJS().map(mediaObj =>
        mediaObj.mediatype === 'video'
          ? pick(mediaObj, ['mediatype', 'video_id', 'overlay', 'inpoint', 'outpoint'])
          : mediaObj))
    })

    updateProject = changes => php.post(`/api/v1/vlog/${this.projectId}`, {...changes})

    deleteProject = () => php.delete(`/api/v1/vlog/${this.projectId}`).then(this.clearProject)

    renderProject = orientation => php.post(`/api/v1/vlog/render/${this.projectId}`, {orientation})

    shareWithTeam = () => this.access !== 'team'
    && this.updateProject(JSON.stringify({access: 'team'}))
    .then(() => this.access = 'team')

    updateTitle = () => this.updateProject(JSON.stringify({title: this.title}))

    updateDescription = () => this.updateProject(JSON.stringify({description: this.description}))

    sendDownload = () => php.get(`/api/v1/vlog/mail/${this.projectId}`)

}

export default ProjectStore;
