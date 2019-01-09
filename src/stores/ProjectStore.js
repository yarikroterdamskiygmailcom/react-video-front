import {observable} from 'mobx';
import {php} from '.';
import {vlogEditorStore as editor, templateStore as templates} from '../';
import {pick} from 'lodash-es';

export class ProjectStore {

  @observable projectId = null;
  @observable title = null;
  @observable description = null;
  @observable access = null;
  @observable status = null;
  @observable renders = null;
  @observable options = {};

  setProperty = (property, value) => this[property] = value;

  setOption = (option, value) => () => this.options = {...this.options, [option]: value}

  toggleOption = option => () => this.options = {...this.options, [option]: !this.options[option]}

  clearProject = () => {
    this.projectId = null;
    this.title = null;
    this.description = null;
    this.access = null;
    this.status = null;
    this.renders = null;
    this.options = null;

    editor.setMedia([]);
    editor.setProjectId(null);
  }

  setProject = id =>
    php.get(`/api/v1/vlog/${id}`).then(project => {
      this.projectId = project.id;
      this.title = project.title;
      this.description = project.description;
      this.access = project.access;
      this.status = project.status;
      this.renders = project.renders;
      this.options = project.options;

      editor.setMedia(project.video);
      editor.setProjectId(this.projectId);
    });

  createProject = professional => php.get(`/api/v1/vlog/new${professional === 'true' ? '?professional=true' : ''}`)
  .then(res => res.project_id)

  reduceMediaObj = mediaObj => mediaObj.mediatype === 'video'
    ? pick(mediaObj, ['mediatype', 'video_id', 'overlay', 'inpoint', 'outpoint'])
    : mediaObj

  saveProject = () => php.post(`/api/v1/vlog/${this.projectId}`, {
    title: this.title,
    description: this.description,
    access: this.access,
    options: JSON.stringify(this.options),
    media: JSON.stringify(editor.media.map(this.reduceMediaObj))
  })

  updateProject = changes => php.post(`/api/v1/vlog/${this.projectId}`, changes)

  deleteProject = () => php.delete(`/api/v1/vlog/${this.projectId}`).then(this.clearProject)

  renderProject = orientation => php.post(`/api/v1/vlog/render/${this.projectId}`, {orientation})

  shareWithTeam = () => this.access !== 'team'
    && this.updateProject({access: 'team'})
    .then(() => this.access = 'team')

  updateTitle = () => this.updateProject({title: this.title})

  updateDescription = () => this.updateProject({description: this.description})

  download = () => php.get(`/vlog/download/${this.projectId}`)

  sendDownload = () => php.get(`/api/v1/vlog/mail/${this.projectId}`)

}

export default ProjectStore;
