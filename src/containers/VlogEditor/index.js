import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router';
import {Arranger, Overlay, Toolbar} from '../../components';
import classNames from 'classnames';
import styles from './styles.scss';
import {ProgressBar, Icon, Toast} from '../../atoms';
import {isEmpty} from 'lodash-es';

@withRouter
@inject('vlogEditor')
@observer
export default class VlogEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: false,
      showToast: false,
      toastContent: ''
    };
  }

  componentDidMount() {
    this.props.vlogEditor.initResumable();
  }

  showToast = text => {
    this.setState({showToast: true, toastContent: text});
    setTimeout(this.hideToast, 5000);
  }

  hideToast = () => this.setState({showToast: false})

  getActions = () => [
    {
      icon: 'camera',
      render: <div className={styles.vidinput} id="input">Video</div>,
      fn: () => null
    },
    {
      icon: 'fade',
      render: <div>Fade</div>,
      fn: this.props.vlogEditor.openAddFade
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

  nextStep = () => {
    if (this.props.vlogEditor.getErrors()) {
      this.showToast(this.props.vlogEditor.getErrors());
    } else {
      this.props.history.push('/configure-vlog');
    }
  }

  render() {
    const {uploading, progress, media, overlayActive, overlayContent, closeOverlay} = this.props.vlogEditor;
    const {showToast, toastContent} = this.state;
    return (
      <div className={styles.container}>
        {isEmpty(media) && <Icon className={styles.backdrop} name="backdrop" />}
        <ProgressBar className={classNames(styles.progressBar, uploading && styles.active)} progress={progress} />
        <div className={styles.header}>Videos & Media</div>
        <Arranger />
        <Toolbar
          className={styles.toolbar}
          actions={this.getActions()}
          allowNext={media.filter(m => m.mediatype === 'video').length > 0}
          next={this.nextStep}
        />
        <Toast active={showToast} onClose={this.hideToast}>
          {toastContent}
        </Toast>
        <Overlay active={overlayActive} onClose={closeOverlay}>
          {overlayContent}
        </Overlay>
      </div>
    );
  }
}
