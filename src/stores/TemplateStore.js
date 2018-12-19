import {observable, action} from 'mobx';
import {php} from '.';
import Resumable from 'resumablejs';
import {isEmpty, flatten} from 'lodash-es';
import {sessionStore as session, vlogEditorStore as editor} from '../';
import {history} from '../constants/routes';

export class TemplateStore {

  @observable templates = []
  @observable projectId = null;
  @observable activeTemplate = null

  setActiveTemplate = template => {
    this.activeTemplate = template.fields;
  }

  setProjectId = id => this.projectId = id

  @action insertMedia = (mediaObj, i) => {
    this.media[i] = mediaObj;
  }

  loadTemplates = async () => this.templates = await php.get('/api/v1/templates', {
    project_id: this.projectId,
  }).then(res => res.templates);

  deleteTemplate = id => php.delete(`/api/v1/templates/${id}`)
  .then(this.loadTemplates)

  @action updateField = (index, changes) => {
    this.activeTemplate = this.activeTemplate.map((field, i) => i === index ? {...field, ...changes} : field);
  }

  @action addContent = (fieldIndex, content) => this.updateField(fieldIndex, {
    contents: [
      ...this.activeTemplate[fieldIndex].contents.toJS(),
      content
    ]
  })

  @action deleteContent = (fieldIndex, contentIndex) => () => this.updateField(fieldIndex, {
    contents: this.activeTemplate[fieldIndex].contents.filter((content, i) => i !== contentIndex)
  })

  @action replaceContent = (fieldIndex, contentIndex) => newContent => this.updateField(fieldIndex, {
    contents: this.activeTemplate[fieldIndex].contents.map((content, i) => i === contentIndex ? newContent : content)
  })

  @action rearrangeContents = fieldIndex => newOrder => {
    this.activeTemplate = this.activeTemplate.map((field, i) => i === fieldIndex ? {...field, contents: newOrder} : field);
  }

  isValid = () => this.activeTemplate.every(field => !isEmpty(field.contents))

  next = () => {
    editor.setMedia(flatten(this.activeTemplate.toJS().map(field => field.contents.toJS())));
    history.push('/configure-vlog');
  }
}

export default TemplateStore;
