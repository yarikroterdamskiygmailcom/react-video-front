import React from 'react';
import {observable} from 'mobx';
import {arrayMove} from 'react-sortable-hoc';

export class AddVlogStore {
    @observable media = ['a', 'b', 'c', 'd', 'e'];

    fileUpload = React.createRef();

    addMedia = media => this.media.push(media)

    onSortEnd = ({oldIndex, newIndex}) => this.media = arrayMove(this.media, oldIndex, newIndex);
}

export default AddVlogStore;
