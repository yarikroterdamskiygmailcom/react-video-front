import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router';
import {Arranger, Overlay, Toolbar, Hamburger, ConfirmProfessional} from '../../components';
import classNames from 'classnames';
import styles from './styles.scss';
import {ProgressBar, Icon, Toast, Toggle, Segment} from '../../atoms';
import {isEmpty, noop} from 'lodash-es';
import FontAwesome from 'react-fontawesome';

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
      toastContent: '',
      hamburgerActive: false,
      syncing: false
    };
  }

  componentDidMount() {
    this.props.vlogEditor.initResumable();
    this.resumableRef.current.children[0].accept = 'video/*';
  }

  componentWillUnmount() {
    this.props.project.updateProject({
      media: JSON.stringify(this.props.vlogEditor.media.toJS().map(this.props.project.reduceMediaObj))
    });
  }

  confirmProfessional = () => {
    this.props.vlogEditor.setOverlay(
      <ConfirmProfessional
        onCancel={this.props.vlogEditor.closeOverlay}
        onConfirm={() => {
          this.props.project.toggleProperty('customEdit');
          this.props.vlogEditor.closeOverlay();
        }}
      />
    );
  }

  showToast = text => {
    this.setState({showToast: true, toastContent: text});
    setTimeout(this.hideToast, 5000);
  }

  hideToast = () => this.setState({showToast: false})

  toggleHamburger = () => this.setState({hamburgerActive: !this.state.hamburgerActive})

  sync = () => this.props.vlogEditor.syncMedia();

  getActions = () => [
    {
      icon: 'camera',
      render: <div
        ref={this.resumableRef}
        className={classNames(styles.vidinput, this.props.vlogEditor.uploading && styles.disabled)}
        id="input"
      >
        {this.props.vlogEditor.uploading ? 'Uploading...' : 'Video'}
      </div>,
      fn: noop
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
      <Icon className={styles.arrow} name="arrowCurved" />
    </React.Fragment>
  )

  render() {
    const {uploading, progress, media, overlayActive, overlayContent, closeOverlay, syncing} = this.props.vlogEditor;
    const {projectId, customEdit, toggleProperty} = this.props.project;
    const {showToast, toastContent, hamburgerActive} = this.state;
    return (
      <div className={styles.container}>
        {isEmpty(media) && this.renderHint()}
        <ProgressBar className={classNames(styles.progressBar, uploading && styles.active)} progress={progress} />
        <FontAwesome className={styles.hamburger} name="bars" onClick={this.toggleHamburger} />
        <div className={styles.sync} onClick={syncing ? noop : this.sync}>
          <FontAwesome className={classNames(styles.syncIcon, syncing && styles.syncing)} name="save" />
          <div className={styles.syncLabel}>{syncing ? 'Syncing' : 'Synced'}</div>
        </div>
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
        <Hamburger active={hamburgerActive} onClose={this.toggleHamburger}>
          <Segment title="Vlog Data">
            <div className={styles.option}>
              <div>Vlog ID</div>
              <div>{`#${projectId}`}</div>
            </div>
          </Segment>
          <Segment title="Extra's">
            <div className={styles.option}>
              <div>Professional Vlog</div>
              <Toggle
                className={styles.customToggle}
                value={customEdit}
                onChange={customEdit ? () => toggleProperty('customEdit') : this.confirmProfessional}
              />
            </div>
          </Segment>
        </Hamburger>
      </div>
    );
  }
}
