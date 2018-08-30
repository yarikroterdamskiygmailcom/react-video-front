import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router';
import {Arranger, Overlay, Toolbar} from '../../components';
import styles from './styles.scss';

@withRouter
@inject('session')
@inject('vlogEditor')
@observer
export default class VlogEditor extends Component {

  constructor(props) {
    super(props);
    !props.vlogEditor.projectId && props.vlogEditor.initBlankVlog();
  }

  componentDidMount() {
    const {session, vlogEditor} = this.props;
    vlogEditor.initResumable(session.sessionId);
  }

  getActions = () => [
    {
      render: <span id="input">Video</span>
    },
    {
      render: <div>Crossfade</div>,
      fn: this.props.vlogEditor.addCrossfade
    },
    {
      render: <div>Title</div>,
      fn: this.props.vlogEditor.openAddTitle
    },
    {
      render: <div>Branding element</div>,
      fn: this.props.vlogEditor.openAddBrandingElement
    }
  ]

  nextStep = () => this.props.history.push('/configure-vlog')

  render() {
    const {media, deleteMedia, openTrimmer, openPreview, onSortEnd, overlayActive, overlayContent, closeOverlay} = this.props.vlogEditor;
    return (
      <div className={styles.container}>
        <Arranger
          items={media}
          onSortEnd={onSortEnd}
          onThumbClick={openPreview}
          onDelete={deleteMedia}
          openTrimmer={openTrimmer}
        />
        <Toolbar actions={this.getActions()} next={this.nextStep}/>
        <Overlay className={styles.overlay} active={overlayActive} content={overlayContent} onClose={closeOverlay}/>
      </div>
    );
  }
}
