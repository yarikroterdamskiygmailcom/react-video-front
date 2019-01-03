import {observable, action} from 'mobx';
import {php} from '.';
import {isEmpty, flatten} from 'lodash-es';
import {vlogEditorStore as editor} from '../';
import {history} from '../constants/routes';

export class TemplateStore {

  @observable fields = []
  @observable projectId = null;
  @observable activeTemplate = null

  assignProjectId = () => php.get('/api/v1/vlog/new')
  .then(({project_id}) => this.projectId = project_id)

  setTemplate = id => php.get(`/api/v1/templates/${id}`)
  .then(template => this.fields = template.fields)

  setProjectId = id => this.projectId = id

  @action insertMedia = (mediaObj, i) => {
    this.media[i] = mediaObj;
  }

  deleteTemplate = id => php.delete(`/api/v1/templates/${id}`)
  .then(this.loadTemplates)

  @action updateField = (index, changes) => {
    this.fields = this.fields.map((field, i) => i === index ? {...field, ...changes} : field);
  }

  @action addContent = (fieldIndex, content) => this.updateField(fieldIndex, {
    contents: [
      ...this.fields[fieldIndex].contents.toJS(),
      content
    ]
  })

  @action deleteContent = (fieldIndex, contentIndex) => () => this.updateField(fieldIndex, {
    contents: this.fields[fieldIndex].contents.filter((content, i) => i !== contentIndex)
  })

  @action replaceContent = (fieldIndex, contentIndex) => newContent => this.updateField(fieldIndex, {
    contents: this.fields[fieldIndex].contents.map((content, i) => i === contentIndex ? newContent : content)
  })

  @action rearrangeContents = fieldIndex => newOrder => {
    this.fields = this.fields.map((field, i) => i === fieldIndex ? {...field, contents: newOrder} : field);
  }

  isValid = () => this.fields.every(field => !isEmpty(field.contents))

  next = () => {
    editor.setMedia(flatten(this.fields.toJS().map(field => field.contents.toJS())));
    history.push('/configure-vlog');
  }
}

export default TemplateStore;
