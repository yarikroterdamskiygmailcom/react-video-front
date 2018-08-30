import React from 'react';
import {Trimmer, AddTitle, AddBrandingElement, Preview} from '../components';
import Resumable from 'resumablejs';
import {observable, values} from 'mobx';
import {arrayMove} from 'react-sortable-hoc';

export class VlogEditorStore {
    @observable media = null
    @observable projectId = null
    @observable overlayActive = false
    @observable overlayContent = null
    @observable currentVideo = null
    @observable uploading = false

    //Editor stuff

    addMedia = mediaObj => this.media = [...this.media, mediaObj]

    deleteMedia = i => {
      this.media = this.media.filter((value, index) => index !== i);
    }

    closeOverlay = () => {
      this.overlayActive = false;
      this.overlayContent = null;
    }

    onSortEnd = ({oldIndex, newIndex}) => this.media = arrayMove(this.media, oldIndex, newIndex);

    //Upload stuff

    initResumable = sessionId => {
      this.resumable = new Resumable({
        target: 'https://intranet.sonicvoyage.nl/fileuploader/web/resumableuploader.php',
        query: {
          SessionID: sessionId,
          action: 'uploadvideo',
          project_id: 4
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

    addVideo = (localFile, response) => this.addMedia({
      ...JSON.parse(response),
      type: 'video',
      localFileObj: localFile,
      src: URL.createObjectURL(localFile)
    });

    //Crossfade stuff

    addCrossfade = () => this.addMedia({type: 'crossfade'})

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

    setTextColor = e => {
      this.title = {
        ...this.title,
        textColor: e.target.value
      };
    }

    setBackgroundColor = e => this.title = {
      ...this.title,
      backgroundColor: e.target.value
    }

    addTitle = () => {
      this.addMedia({
        type: 'title',
        ...this.title
      });
      this.closeOverlay();
    }

    //Trimmer stuff

    @observable trimmer = {
      startTime: 0,
      endTime: 0,
      duration: 0
    }

    openTrimmer = i => {
      this.currentVideo = this.media[i];
      this.overlayActive = true;
      this.overlayContent = <Trimmer/>;
    }

    initEndTime = duration => {
      this.trimmer = {
        ...this.trimmer,
        endTime: duration,
        duration: duration
      };
    }

    setStartTime = e => {
      if (e.target.value < this.trimmer.endTime) {
        this.trimmer = {...this.trimmer, startTime: e.target.value};
      }
    }

    setEndTime = e => {
      if(e.target.value > this.trimmer.startTime) {
        this.trimmer = {...this.trimmer, endTime: e.target.value};
      }
    }

    trimVideo = () => {
      this.currentVideo.inpoint = parseInt(this.trimmer.startTime * this.currentVideo.framerate, 10);
      this.currentVideo.outpoint = parseInt(this.trimmer.endTime * this.currentVideo.framerate, 10);
      this.overlayActive = false;
      this.overlayContent = null;
    }

    //Add Branding Element stuff

    openAddBrandingElement = () => {
      this.overlayActive = true;
      this.overlayContent = <AddBrandingElement/>;
    }

    AddBrandingElement = asset => {
      this.addMedia({
        ...asset,
        type: 'asset'
      });
      this.closeOverlay();
    }

    //Preview stuff

    openPreview = i => {
      this.currentVideo = this.media[i];
      this.overlayActive = true;
      this.overlayContent = <Preview src={this.currentVideo.src}/>;
    }

    //When initializing the editor

    initBlankVlog = () => {
      this.media = [];
      this.projectId = 'dud';
    }

    setVlog = vlog => {
      this.media = vlog.video;
      this.media = this.media.map(media => ({
        ...media,
        type: media.videotype,
        src: media.videourl
      }));
      this.projectId = vlog.project_id;
    }

}

export default VlogEditorStore;
