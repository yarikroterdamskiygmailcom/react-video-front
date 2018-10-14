import React from 'react';
import {Trimmer, AddTitle, AddBrandingElement, AddOverlay, Preview, EditCrossfade} from '../components';
import Resumable from 'resumablejs';
import {observable, action} from 'mobx';
import {arrayMove} from 'react-sortable-hoc';
import {sessionStore} from '../';
import {php} from '.';

export class VlogEditorStore {
    @observable media = null
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
      this.media = null;
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
    }

    onSortEnd = ({oldIndex, newIndex}) => this.media = arrayMove(this.media, oldIndex, newIndex);

    //Upload stuff

    initResumable = () => {
      this.resumable = new Resumable({
        target: 'https://intranet.sonicvoyage.nl/fileuploader/web/resumableuploader.php',
        query: {
          SessionID: sessionStore.sessionId,
          action: 'uploadvideo',
          project_id: this.projectId
        }
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

    //Crossfade stuff

    addCrossfade = duration => this.addMedia({
      mediatype: 'crossfade',
      duration: duration || 2
    })

    openEditCrossfade = index => () => {
      this.overlayActive = true;
      this.overlayContent = (
        <EditCrossfade
          crossfade={this.media[index]}
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
          onSave={this.saveMedia(index)}
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

    getProjectId = () => php.post('handleproject.php', {
      debug: true,
      react: true,
      action: 'new',
    }).then(res => this.projectId = res.project_id);

    initMedia = () => this.media = []

    initBlankVlog = () => {
      this.media = [];
      return php.post('handleproject.php', {
        debug: true,
        react: true,
        action: 'new',
      }).then(res => this.projectId = res.project_id);
    }

    setVlog = vlog => {
      this.media = vlog.video;
      this.projectId = vlog.project_id;
      this.title = vlog.title;
    }

}

export default VlogEditorStore;
