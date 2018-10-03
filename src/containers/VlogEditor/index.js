import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router';
import {Arranger, Overlay, Toolbar} from '../../components';
import classNames from 'classnames';
import styles from './styles.scss';

@withRouter
@inject('vlogEditor')
@observer
export default class VlogEditor extends Component {

  componentDidMount() {
    this.props.fromScratch
      ? this.props.vlogEditor.initBlankVlog().then(() => this.props.vlogEditor.initResumable())
      : this.props.vlogEditor.initResumable();
  }

  getActions = () => [
    {
      icon: 'camera',
      render: <span id="input">Video</span>,
      fn: () => null
    },
    {
      icon: 'crossfade',
      render: <div>Crossfade</div>,
      fn: this.props.vlogEditor.openAddCrossfade
    },
    {
      icon: 'title',
      render: <div>Title</div>,
      fn: this.props.vlogEditor.openAddTitle
    },
    {
      icon: 'branding',
      render: <div>Branding</div>,
      fn: this.props.vlogEditor.openAddBrandingElement
    }
  ]

  nextStep = () => this.props.history.push('/configure-vlog')

  render() {
    const {uploading, media, deleteMedia, openTrimmer, openPreview, onSortEnd, openLowerThird, overlayActive, overlayContent, closeOverlay} = this.props.vlogEditor;
    return (
      <div className={styles.container}>
        <div className={classNames(styles.uploadingIndicator, uploading && styles.active)}>Uploading your video...</div>
        <div className={styles.header}>Videos & Media</div>
        {media && <Arranger
          items={media}
          onSortEnd={onSortEnd}
          onThumbClick={openPreview}
          onDelete={deleteMedia}
          openTrimmer={openTrimmer}
          onLowerThird={openLowerThird}
        />}
        <Toolbar className={styles.toolbar} actions={this.getActions()} next={this.nextStep}/>
        <Overlay className={styles.overlay} active={overlayActive} content={overlayContent} onClose={closeOverlay}/>
      </div>
    );
  }
}
