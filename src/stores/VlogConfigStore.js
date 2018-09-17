import {observable} from 'mobx';
import {vlogEditorStore as editor} from '../';

export class VlogConfigStore {

  @observable orientation = '16:9'

    init = () => {
      this.title = editor.title || 'Untitled';
    }

    toggleOrientation = () => this.orientation = this.orientation === '16:9' ? '9:16' : '16:9'

}

export default VlogConfigStore;
