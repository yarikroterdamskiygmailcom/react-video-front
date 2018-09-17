import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router';
import {Arranger, Overlay, Toolbar} from '../../components';
import styles from './styles.scss';

@withRouter
@inject('vlogEditor')
@observer
export default class VlogEditor extends Component {

  constructor(props) {
    super(props);
    !props.vlogEditor.projectId && props.vlogEditor.initBlankVlog();
  }

  componentDidMount() {
    this.props.vlogEditor.initResumable();
  }

  componentWillUnmount() {
    this.props.vlogEditor.initBlankVlog();
  }

  getActions = () => [
    {
      icon: 'camera',
      render: <span id="input">Video</span>
    },
    {
      icon: 'random',
      render: <div>Crossfade</div>,
      fn: this.props.vlogEditor.addCrossfade
    },
    {
      icon: 'font',
      render: <div>Title</div>,
      fn: this.props.vlogEditor.openAddTitle
    },
    {
      icon: 'fire',
      render: <div>Branding element</div>,
      fn: this.props.vlogEditor.openAddBrandingElement
    }
  ]

  nextStep = () => this.props.history.push('/configure-vlog')

  render() {
    const {uploading, media, deleteMedia, openTrimmer, openPreview, onSortEnd, openLowerThird, overlayActive, overlayContent, closeOverlay} = this.props.vlogEditor;
    return (
      <div className={styles.container}>
        {uploading && <div className={styles.uploadingIndicator}>Uploading your video...</div>}
        <div className={styles.header}>Videos & Media</div>
        <Arranger
          items={media}
          onSortEnd={onSortEnd}
          onThumbClick={openPreview}
          onDelete={deleteMedia}
          openTrimmer={openTrimmer}
          onLowerThird={openLowerThird}
        />
        <Toolbar className={styles.toolbar} actions={this.getActions()} next={this.nextStep}/>
        <Overlay className={styles.overlay} active={overlayActive} content={overlayContent} onClose={closeOverlay}/>
      </div>
    );
  }
}
