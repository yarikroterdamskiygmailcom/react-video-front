import React from 'react';
import {Trimmer, AddTitle, AddBrandingElement, AddOverlay, Preview, EditFade} from '../components';
import Resumable from 'resumablejs';
import {observable, action} from 'mobx';
import {arrayMove} from 'react-sortable-hoc';
import {sessionStore} from '../';
import {php} from '.';

export class VlogEditorStore {
    @observable media = []
    @observable title = null
    @observable projectId = null
    @observable overlayActive = false
    @observable overlayContent = null
    @observable currentVideo = null
    @observable uploading = false
    @observable progress = 0

    //Editor stuff

    cleanup = () => {
      console.log('warning: cleaning up!!!!!');
      this.media = [];
      this.title = null;
      this.projectId = null;
    }

    @action addMedia = mediaObj => {
      this.media = [...this.media.toJS(), mediaObj];
    }

    @action updateMedia = (index, changes) => {
      if (this.media[index]) {
        this.media = this.media.map((mediaObj, i) => i === index ? {...mediaObj, ...changes} : mediaObj);
      } else {
        throw new Error(`Tried to replace media[${index}], but it doesn't exist`);
      }
    }

    deleteMedia = i => {
      this.media = this.media.filter((value, index) => index !== i);
    }

    saveMedia = index => changes => this.updateMedia(index, changes)

    closeOverlay = () => {
      this.overlayActive = false;
      setTimeout(() => this.overlayContent = null, 200);
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
        fileType: ['mp4']
      });

      this.resumable.assignBrowse(document.getElementById('input'));

      this.resumable.on('fileAdded', () => {
        this.resumable.upload();
        this.uploading = true;
      });

      this.resumable.on('fileSuccess', (resumableFile, response) => {
        this.addMedia(JSON.parse(response));
        this.uploading = false;
        this.resumable.cancel();
        this.progress = 0;
      });

      this.resumable.on('progress', () => this.progress = this.resumable.progress() * 100);

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

    openTrimmer = index => {
      this.overlayActive = true;
      this.overlayContent = (
        <Trimmer
          onClose={this.closeOverlay}
          onSave={this.saveMedia(index)}
          video={this.media[index]}
        />
      );
    }

    //Add Branding Element stuff

    openAddBrandingElement = () => {
      this.overlayActive = true;
      this.overlayContent = <AddBrandingElement/>;
    }

    AddBrandingElement = asset => {
      this.addMedia({
        ...asset,
        mediatype: 'asset'
      });
      this.closeOverlay();
    }

    //Lower third stuff

    openLowerThird = index => {
      this.overlayActive = true;
      this.overlayContent = (
        <AddOverlay
          onClose={this.closeOverlay}
          onSave={overlayArr => this.media[index].overlay.replace(overlayArr)}
          video={this.media[index]}
        />
      );
    }

    //Preview stuff

    openPreview = i => () => {
      this.currentVideo = this.media[i];
      this.overlayActive = true;
      this.overlayContent = (
        <Preview
          src={this.currentVideo.src}
          start={this.currentVideo.inpoint}
          stop={this.currentVideo.outpoint}
        />
      );
    }

    //When initializing the editor

    getProjectId = () => php.get('/api/v1/vlog/new')
    .then(res => this.projectId = res.project_id);

    initBlankVlog = () => {
      this.media = [];
      return php.get('/api/v1/vlog/new')
      .then(res => this.projectId = res.project_id);
    }

    setVlog = vlog => {
      this.media = vlog.video.filter(media => Boolean(media));
      this.projectId = vlog.project_id;
      this.title = vlog.title;
    }

}

export default VlogEditorStore;
