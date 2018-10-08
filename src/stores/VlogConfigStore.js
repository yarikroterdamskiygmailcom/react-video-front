import {observable, toJS} from 'mobx';
import {php} from '.';
import {vlogEditorStore as editor, sessionStore as session} from '..';
import {pick} from 'lodash-es';

export class VlogConfigStore {

  @observable vlogTitle = ''
  @observable vlogDescription = ''
  @observable filter = null
  @observable useFilter = false
  @observable orientation = '16:9'
  @observable customSubs = false
  @observable customEdit = false

  @observable rendering = false
  @observable renderUrl = null

  changeVlogTitle = e => this.vlogTitle = e.target.value

  changeVlogDescription = e => this.vlogDescription = e.target.value

  setFilter = filter => () => this.filter = filter

  toggleFilter = () => this.useFilter = !this.useFilter;

  toggleOrientation = () => this.orientation = this.orientation === '16:9' ? '9:16' : '16:9';

  toggleSubs = () => this.customSubs = !this.customSubs;

  toggleEdit = () => this.customEdit = !this.customEdit;

    init = () => {
      this.title = editor.title || 'Untitled';
    }

  shrinkMedia = media => {
    const shrunk = media.map(m =>
      m.mediatype === 'video'
        ? pick(m, ['mediatype', 'video_id', 'lowerthird', 'inpoint', 'outpoint'])
        : m
    );
    return JSON.stringify(shrunk);
  }

    renderVlog = async () => {
      this.rendering = true;
      await php.post('handleproject.php', {
        debug: true,
        react: true,
        action: 'save',
        project_id: editor.projectId,
        vlog_title: this.vlogTitle,
        vlog_desc: this.vlogDescription,
        color_filter: this.useFilter ? this.filter : null,
        custom_subs: this.customSubs,
        custom_edit: this.customEdit,
        media: this.shrinkMedia(toJS(editor.media))
      });
      await php.post('export.php', {
        debug: true,
        react: true,
        project_id: editor.projectId,
        orientation: this.orientation,
      }).then(res => {
        this.rendering = false;
        if(res.videourl) {
          this.renderUrl = res.videourl;
        }
      });
    }
}

export default VlogConfigStore;
