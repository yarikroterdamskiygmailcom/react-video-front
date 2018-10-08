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

    //Editor stuff

    cleanup = () => {
      this.media = null;
      this.title = null;
      this.projectId = null;
    }

    @action addMedia = mediaObj => {
      this.media = [...this.media.toJS(), mediaObj];
    }

    @action replaceMedia = (index, mediaObj) => {
      if (this.media[index]) {
        this.media = this.media.map((m, i) => i === index ? mediaObj : m);
      } else {
        throw new Error(`Tried to replace media[${index}], but it doesn't exist`);
      }
    }

    deleteMedia = i => {
      this.media = this.media.filter((value, index) => index !== i);
    }

    closeOverlay = () => {
      this.overlayActive = false;
      this.overlayContent = null;
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
        this.addVideo(resumableFile.file, response);
        this.uploading = false;
        this.resumable.cancel();
      });
    }

    addVideo = (localFile, response) => console.log(response) || this.addMedia({
      ...JSON.parse(response),
      mediatype: 'video',
      localFileObj: localFile,
      src: URL.createObjectURL(localFile)
    });

    //Crossfade stuff

    addCrossfade = duration => this.addMedia({
      mediatype: 'crossfade',
      duration: duration || 2
    })

    saveCrossfade = index => crossfade => this.replaceMedia(index, crossfade)

    openEditCrossfade = index => () => {
      this.overlayActive = true;
      this.overlayContent = (
        <EditCrossfade
          crossfade={this.media[index]}
          onClose={this.closeOverlay}
          onSave={this.saveCrossfade(index)}
        />
      );
    }

    //Add Title stuff

    @observable title = {
      text: '',
      textColor: '#000000',
      backgroundColor: '#FFFFFF'
    }

    openAddTitle = () => {
      this.overlayActive = true;
      this.overlayContent = <AddTitle/>;
    }

    setText = e => this.title = {
      ...this.title,
      text: e.target.value
    }

    setTextColor = color => {
      this.title = {
        ...this.title,
        textColor: color
      };
    }

    setBackgroundColor = color => this.title = {
      ...this.title,
      backgroundColor: color
    }

    addTitle = () => {
      this.addMedia({
        mediatype: 'title',
        ...this.title
      });
      this.closeOverlay();
    }

    //Trimmer stuff

    openTrimmer = i => {
      this.currentVideo = this.media[i];
      this.overlayActive = true;
      this.overlayContent = <Trimmer video={this.currentVideo} onClose={this.closeOverlay}/>;
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

    openLowerThird = i => {
      this.currentVideo = this.media[i];
      this.overlayActive = true;
      this.overlayContent = <AddOverlay video={this.currentVideo} onClose={this.closeOverlay}/>;
    }

    //Preview stuff

    openPreview = i => () => {
      this.currentVideo = this.media[i];
      this.overlayActive = true;

      this.overlayContent = <Preview src={this.currentVideo.src}/>;
    }

    //When initializing the editor

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
