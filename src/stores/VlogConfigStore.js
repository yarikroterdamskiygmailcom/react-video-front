import {observable} from 'mobx';

export class VlogConfigStore {

    @observable title = ''
    @observable desc = ''
    @observable useColorFilter = false
    @observable colorFilter = '#edd789'
    @observable logoOverlay = true
    @observable subtitles = false
    @observable edit = false

    setTitle = e => this.title = e.target.value
    setDesc = e => this.desc = e.target.value
    setUseColorFilter = val => this.useColorFilter = val
    setColorFilter = e => this.colorFilter = e.target.value
    setLogoOverlay = val => this.logoOverlay = val
    setSubtitles = val => this.subtitles = val
    setEdit = val => this.edit = val
}

export default VlogConfigStore;
