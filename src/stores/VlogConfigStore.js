import {observable, toJS} from 'mobx';
import {php} from '.';
import {vlogEditorStore as editor, sessionStore as session} from '..';
import {pick} from 'lodash-es';

export class VlogConfigStore {

  @observable vlogTitle = ''
  @observable vlogDescription = ''
  @observable filter = null
  @observable useFilter = false
  @observable useLogoOverlay = false
  @observable orientation = 'landscape'
  @observable customSubs = false
  @observable customEdit = false
  @observable shareWithTeam = true

  @observable rendering = false
  @observable renderUrl = null

  changeVlogTitle = e => this.vlogTitle = e.target.value

  changeVlogDescription = e => this.vlogDescription = e.target.value

  setFilter = filter => () => this.filter = filter

  toggleFilter = () => this.useFilter = !this.useFilter;

  toggleLogoOverlay = () => this.useLogoOverlay = !this.useLogoOverlay;

  toggleOrientation = () => this.orientation = this.orientation === 'landscape' ? 'portrait' : 'landscape';

  toggleSubs = () => this.customSubs = !this.customSubs;

  toggleEdit = () => this.customEdit = !this.customEdit;

  toggleShareWithTeam = () => this.shareWithTeam = !this.shareWithTeam

  init = () => {
    this.title = editor.title || 'Untitled';
  }

  cleanup = () => {
    this.renderUrl = null;
  }

  shrinkMedia = media => {
    const shrunk = media.map(m =>
      m.mediatype === 'video'
        ? pick(m, ['mediatype', 'video_id', 'overlay', 'inpoint', 'outpoint'])
        : m
    );
    return JSON.stringify(shrunk);
  }

  getOptions = () => JSON.stringify({
    logo_overlay: this.useLogoOverlay,
    custom_subs: this.customSubs,
    custom_edit: this.customEdit,
    filter: this.useFilter ? this.useFilter : undefined
  });

  renderVlog = async () => {
    this.rendering = true;
    await php.post(`/api/v1/vlog/${editor.projectId}`, {
      title: this.vlogTitle,
      description: this.vlogDescription,
      options: this.getOptions(),
      media: this.shrinkMedia(toJS(editor.media))
    });
    await php.post(`/api/v1/vlog/render/${editor.projectId}`, {
      orientation: this.orientation,
    }).then(res => {
      this.rendering = false;
      if (res.videourl) {
        this.renderUrl = res.videourl;
      }
    });
  }
}

export default VlogConfigStore;
