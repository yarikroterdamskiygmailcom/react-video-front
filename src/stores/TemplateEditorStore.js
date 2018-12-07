import {observable, action} from 'mobx';
import {omit} from 'lodash-es';
import {php, userDB} from '.';

export class TemplateEditorStore {
    @observable template = []

    @action addField = field => this.template = [...this.template.toJS(), field]

    @action updateField = (index, changes) => {
      this.template = this.template.map((field, i) => i === index ? {...field, ...changes} : field);
    }

    @action deleteField = index => this.template = this.template.filter((field, i) => i !== index)

    saveTemplate = async () => {
      const me = await userDB.get('api/v1/auth/user/');
      const template = {
        title: 'New Template',
        fields: JSON.stringify(this.template.toJS().map(field => omit(field, ['icon']))),
        owner: JSON.stringify(me)
      };
      return php.post('api/v1/templates', template).then(res => res.template_id);
    }

}

export default TemplateEditorStore;
