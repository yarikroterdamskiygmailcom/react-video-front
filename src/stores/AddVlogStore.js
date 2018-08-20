import React from 'react';
import {observable} from 'mobx';
import {without} from 'lodash-es';
import {php} from '.';
import encode from 'object-to-formdata';
import {arrayMove} from 'react-sortable-hoc';
import Resumable from 'resumablejs';
import {Preview} from '../components';

export class AddVlogStore {
    @observable media = [];
    @observable resumable = {};
    @observable overlay = null;

    initResumable = sessionId => {
      this.resumable = new Resumable({
        target: 'https://intranet.sonicvoyage.nl/fileuploader/web/resumableuploader.php',
        query: {
          SessionID: sessionId,
          action: 'upload',
          project_id: 4
        }
      });
      this.resumable.assignBrowse(document.getElementById('input'));
      this.resumable.on('fileAdded', () => {
        this.resumable.upload();
      });
      this.resumable.on('fileSuccess', (resumableFile, response) => {
        this.addMedia(resumableFile.file, response);
        this.resumable.cancel();
      });
    }

    showOverlay = i => this.overlay = <Preview src={this.media[i].localFileObjURL}/>
    closeOverlay = () => this.overlay = null;

    deleteMedia = i => this.media = this.media.filter((value, index) => index !== i)

    setSessionId = sessionId => this.sessionId = sessionId;

    addMedia = (localFile, response) => this.media = [
      ...this.media, {
        ...JSON.parse(response),
        localFileObj: localFile,
        localFileObjURL: URL.createObjectURL(localFile)
      }
    ]

    onSortEnd = ({oldIndex, newIndex}) => this.media = arrayMove(this.media, oldIndex, newIndex);
}

export default AddVlogStore;
