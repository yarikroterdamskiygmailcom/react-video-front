import React from 'react';
import {Trimmer, AddTitle, AddBrandingElement, LowerThird, Preview} from '../components';
import Resumable from 'resumablejs';
import {observable, values} from 'mobx';
import {arrayMove} from 'react-sortable-hoc';
import {sessionStore} from '../';

export class VlogEditorStore {
    @observable media = null
    @observable title = null
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

    initResumable = () => {
      this.resumable = new Resumable({
        target: 'https://intranet.sonicvoyage.nl/fileuploader/web/resumableuploader.php',
        query: {
          SessionID: sessionStore.sessionId,
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
      mediatype: 'video',
      localFileObj: localFile,
      src: URL.createObjectURL(localFile)
    });

    //Crossfade stuff

    addCrossfade = () => this.addMedia({mediatype: 'crossfade'})

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

    setTrim = values => {
      this.trimmer = {
        ...this.trimmer,
        startTime: values[0],
        endTime: values[1]
      };
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
        mediatype: 'asset'
      });
      this.closeOverlay();
    }

    //Lower third stuff

    @observable lowerThirdSide = 'left';

    openLowerThird = () => {
      this.overlayActive = true;
      this.overlayContent = <LowerThird/>;
    }

      toggleLowerThirdSide = () => {
        this.lowerThirdSide = this.lowerThirdSide === 'left' ? 'right' : 'left';
      };

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
      this.projectId = vlog.project_id;
      this.title = vlog.title;
    }

}

export default VlogEditorStore;
