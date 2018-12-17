import React from 'react';
import {AddTitle, AddBrandingElement, AddOverlay, Blurring, Preview, EditFade, Configure, TrimmerSplitter} from '../components';
import Resumable from 'resumablejs';
import {observable, action} from 'mobx';
import {arrayMove} from 'react-sortable-hoc';
import {sessionStore} from '../';
import {php} from '.';
import {head, last, pick, flatten} from 'lodash-es';

export class VlogEditorStore {
  @observable media = []
  @observable projectId = null
  @observable overlayActive = false
  @observable overlayContent = null
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

  setProjectId = id => this.projectId = id;

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
  }

  setOverlay = overlay => {
    this.overlayActive = true;
    this.overlayContent = overlay;
  };

  closeOverlay = () => {
    this.overlayActive = false;
    setTimeout(() => this.overlayContent = null, 200);
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

  initResumable = () => {
    this.resumable = new Resumable({
      target: 'https://intranet.sonicvoyage.nl/fileuploader/web/resumableuploader.php',
      query: {
        SessionID: sessionStore.token,
        action: 'uploadvideo',
        project_id: this.projectId
      },
    });

    this.resumable.assignBrowse(document.getElementById('input'));

    this.resumable.on('fileAdded', () => {
      this.resumable.upload();
      this.uploading = true;
    });

    this.resumable.on('fileSuccess', (resumableFile, response) => {
      const properties = ['duration', 'inpoint', 'outpoint', 'mediatype',
        'overlay', 'seconds', 'src', 'thumb', 'thumbbase64', 'video_id', 'videoname'];
      this.addMedia(pick(JSON.parse(response), properties));
      this.uploading = false;
      this.resumable.cancel();
      this.progress = 0;
    });

    this.resumable.on('progress', () => this.progress = this.resumable.progress() * 100);

    this.resumable.on('error', () => {
      sessionStore.showError('There was a problem during upload. Please check your internet connection or try again later.');
      this.progress = 0;
      this.resumable.cancel();
    });

  }

  //fade stuff

  openAddFade = () => {
    this.overlayActive = true;
    this.overlayContent = (
      <EditFade
        onClose={this.closeOverlay}
        onSave={this.addMedia}
      />
    );
  }

  openEditFade = index => () => {
    this.overlayActive = true;
    this.overlayContent = (
      <EditFade
        fade={this.media[index]}
        onClose={this.closeOverlay}
        onSave={this.saveMedia(index)}
      />
    );
  }

  //Add Title stuff

  openAddTitle = () => {
    this.overlayActive = true;
    this.overlayContent = (
      <AddTitle
        onClose={this.closeOverlay}
        onSave={this.addMedia}
      />
    );
  }

  openEditTitle = index => () => {
    this.overlayActive = true;
    this.overlayContent = (
      <AddTitle
        onClose={this.closeOverlay}
        onSave={this.saveMedia(index)}
        title={this.media[index]}
      />
    );
  }

  //Trimmer stuff

  openTrimmerSplitter = index => () => {
    this.overlayActive = true;
    this.overlayContent = (
      <TrimmerSplitter
        onClose={this.closeOverlay}
        onTrim={this.saveMedia(index)}
        onSplit={this.splitVideo(index)}
        video={this.media[index]}
      />
    );
  }

  //Splitter stuff

  openSplitter = index => () => {
    this.overlayActive = true;
    this.overlayContent = (
      <Splitter
        onClose={this.closeOverlay}
        onSave={this.splitVideo(index)}
        video={this.media[index]}
      />
    );
  }

  //Add Branding Element stuff

  openAddBrandingElement = () => {
    this.overlayActive = true;
    this.overlayContent = (
      <AddBrandingElement
        onClose={this.closeOverlay}
        onSave={this.addMedia}
      />
    );
  }

  //Lower third stuff

  openAddOverlay = index => () => {
    this.overlayActive = true;
    this.overlayContent = (
      <AddOverlay
        onClose={this.closeOverlay}
        onSave={this.saveMedia(index)}
        video={this.media[index]}
      />
    );
  }

  //Blurring

  openBlurring = index => () => {
    this.overlayActive = true;
    this.overlayContent = (
      <Blurring
        onClose={this.closeOverlay}
        onSave={this.saveMedia(index)}
        video={this.media[index]}
      />
    );
  }

  //Configure stuff

  openConfigure = index => () => {
    this.overlayActive = true;
    this.overlayContent = (
      <Configure
        onClose={this.closeOverlay}
        videoIndex={index}
      />
    );
  }

  //Preview stuff

  openPreview = i => () => {
    this.overlayActive = true;
    this.overlayContent = (
      <Preview
        src={this.media[i].src}
        start={this.media[i].inpoint}
        stop={this.media[i].outpoint}
      />
    );
  }
}

export default VlogEditorStore;
