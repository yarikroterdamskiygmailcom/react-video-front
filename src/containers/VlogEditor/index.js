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
@inject('project')
@observer
export default class VlogEditor extends Component {
  constructor(props) {
    super(props);
    this.resumableRef = React.createRef();
    this.state = {
      pending: false,
      showToast: false,
      toastContent: ''
    };
  }

  componentDidMount() {
    this.props.vlogEditor.initResumable();
    this.resumableRef.current.children[0].accept = 'video/*';
  }

  componentWillUnmount() {
    this.props.project.updateProject({media: JSON.stringify(this.props.vlogEditor.media.toJS())});
  }

  showToast = text => {
    this.setState({showToast: true, toastContent: text});
    setTimeout(this.hideToast, 5000);
  }

  hideToast = () => this.setState({showToast: false})

  getActions = () => [
    {
      icon: 'camera',
      render: <div ref={this.resumableRef} className={styles.vidinput} id="input">Video</div>,
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

  renderHint = () => (
    <React.Fragment>
      <Icon className={styles.backdrop} name="backdrop" />
      <Icon className={styles.arrow} name="arrow"/>
    </React.Fragment>
  )

  render() {
    const {uploading, progress, media, overlayActive, overlayContent, closeOverlay} = this.props.vlogEditor;
    const {showToast, toastContent} = this.state;
    return (
      <div className={styles.container}>
        {isEmpty(media) && this.renderHint()}
        <ProgressBar className={classNames(styles.progressBar, uploading && styles.active)} progress={progress} />
        <div className={styles.header}>Videos & Media</div>
        <Arranger />
        <Toolbar
          className={styles.toolbar}
          actions={this.getActions()}
          allowNext={media.some(mediaObj => ['video', 'title', 'asset'].includes(mediaObj.mediatype))}
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
