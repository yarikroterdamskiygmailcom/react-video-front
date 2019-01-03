import Resumable from 'resumablejs';
import {observable, action} from 'mobx';
import {arrayMove} from 'react-sortable-hoc';
import {sessionStore} from '../';
import {php} from '.';
import {head, last, pick, flatten, sortBy, findIndex} from 'lodash-es';

export class VlogEditorStore {
  @observable media = []
  @observable projectId = null
  @observable uploading = false
  @observable progress = 0
  @observable syncing = false

  //Editor stuff

  syncMedia = () => {
    this.syncing = true;
    return php.post(`/api/v1/vlog/${this.projectId}`, {media: JSON.stringify(this.media.toJS())})
    .then(() => this.syncing = false);
  }

  setMedia = media => this.media = media;

  setProjectId = id => {
    this.projectId = id;
  }

  @action addMedia = mediaObj => {
    this.media = [...this.media.toJS(), mediaObj];
    this.syncMedia();
  }

  @action updateMedia = (index, changes) => {
    if (this.media[index]) {
      this.media = this.media.map((mediaObj, i) => i === index ? {...mediaObj, ...changes} : mediaObj);
      this.syncMedia();
    } else {
      throw new Error(`Tried to replace media[${index}], but it doesn't exist`);
    }
  }

  deleteMedia = i => {
    this.media = this.media.filter((value, index) => index !== i);
    this.syncMedia();
  }

  saveMedia = index => changes => this.updateMedia(index, changes)

  @action splitVideo = index => splitPoint => {
    const video = this.media[index];
    const newVideos = [
      {...video, outpoint: splitPoint},
      {...video, inpoint: splitPoint}
    ];
    this.media = flatten(
      this.media.map((mediaObj, i) => i === index ? newVideos : mediaObj)
    );
    this.syncMedia();
  }

  getErrors = () => {
    const media = this.media.toJS();

    const fades = ['fadein', 'fadeout', 'fadeoutin', 'crossfade'];
    const interFades = ['crossfade', 'fadeoutin'];

    if (media.some((mediaObj, i) => {
      if (fades.includes(mediaObj.mediatype) && media[i + 1] && fades.includes(media[i + 1].mediatype)) {
        return true;
      }
    })) {
      return `Two fades can't succeed each other.`;
    }

    if (media.some((mediaObj, i) => {
      if (
        (mediaObj.mediatype === 'crossfade'
          && (
            (media[i - 1] && media[i - 1].outpoint - media[i - 1].inpoint) < mediaObj.duration / 2
            || (media[i + 1] && media[i + 1].outpoint - media[i + 1].inpoint) < mediaObj.duration / 2
          )
        )
      ) {
        return true;
      }
      return false;
    })) {
      return 'Videos can only be crossfaded if they are longer than half the crossfade duration';
    }

    if (interFades.includes(head(media).mediatype)
      || interFades.includes(last(media).mediatype)) {
      return `Vlogs can't start or end with a Crossfade or a Fade-Out / Fade-In.`;
    }

    return null;
  }

  onSortEnd = ({oldIndex, newIndex}) => this.media = arrayMove(this.media, oldIndex, newIndex);

  //Upload stuff

  initResumable = (id, domNode) => {
    this.resumable = new Resumable({
      target: 'https://videodb.vlogahead.cloud/api/v1/video/upload',
      query: {
        action: 'uploadvideo',
        project_id: id
      },
      headers: {
        Authorization: `Token ${sessionStore.token}`
      },
      chunkRetryInterval: 1000
    });

    this.resumable.assignBrowse(domNode);

    this.resumable.on('fileAdded', () => {
      this.resumable.upload();
      this.uploading = true;
    });

    this.resumable.on('fileSuccess', (resumableFile, response) => {
      const properties = ['duration', 'inpoint', 'outpoint', 'mediatype',
        'overlay', 'seconds', 'src', 'thumb', 'video_id', 'videoname'];
      this.addMedia(pick(JSON.parse(response), properties));
      this.uploading = false;
      this.resumable.cancel();
      this.progress = 0;
    });

    this.resumable.on('fileRetry', () => sessionStore.showError('Upload interrupted. Retrying...'));

    this.resumable.on('fileProgress', file => this.progress = file.progress() * 100);

  }

  cancelUpload = () => {
    this.uploading = false;
    this.resumable.cancel();
    this.progress = 0;
  }

  getChronoIndex = targetVideo => {
    const videos = this.media.toJS().filter(mediaObj => mediaObj.mediatype === 'video');
    const equalVideos = videos.filter(video => video.video_id === targetVideo.video_id);
    const sorted = sortBy(equalVideos, 'inpoint');
    const chronoIndex = findIndex(sorted, targetVideo);
    return chronoIndex + 1;
  }

}

export default VlogEditorStore;
