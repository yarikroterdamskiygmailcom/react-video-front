import {observable} from 'mobx';
import {vlogEditorStore as editor} from '../';

export class VlogConfigStore {

    @observable title = null
    @observable desc = ''
    @observable useColorFilter = false
    @observable colorFilter = '#edd789'
    @observable logoOverlay = true
    @observable subtitles = false
    @observable edit = false

    init = () => {
      this.title = editor.title || 'Untitled';
    }

    setTitle = e => this.title = e.target.value
    setDesc = e => this.desc = e.target.value
    setUseColorFilter = val => this.useColorFilter = val
    setColorFilter = e => this.colorFilter = e.target.value
    setLogoOverlay = val => this.logoOverlay = val
    setSubtitles = val => this.subtitles = val
    setEdit = val => this.edit = val
}

export default VlogConfigStore;
