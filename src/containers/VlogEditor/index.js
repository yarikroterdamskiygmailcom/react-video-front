import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router';
import {Arranger, Overlay, Toolbar, Hamburger, Modal} from '../../components';
import classNames from 'classnames';
import styles from './styles.scss';
import {ProgressBar, Icon, Toast, Toggle, Segment} from '../../atoms';
import {isEmpty} from 'lodash-es';
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
      hamburgerActive: false
    };
  }

  componentDidMount() {
    this.props.vlogEditor.initResumable();
    this.resumableRef.current.children[0].accept = 'video/*';
  }

  componentWillUnmount() {
    this.props.project.updateProject({media: JSON.stringify(this.props.vlogEditor.media.toJS())});
  }

  confirmProfessional = () => {
    this.props.vlogEditor.setOverlay(this.renderConfirmProfessional());
  }

    showToast = text => {
      this.setState({showToast: true, toastContent: text});
      setTimeout(this.hideToast, 5000);
    }

  hideToast = () => this.setState({showToast: false})

  toggleHamburger = () => this.setState({hamburgerActive: !this.state.hamburgerActive})

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

  modalActions = [
    {
      label: 'Cancel',
      func: this.props.vlogEditor.closeOverlay
    },
    {
      label: 'Confirm',
      func: () => {
        this.props.project.toggleProperty('customEdit');
        this.props.vlogEditor.closeOverlay();
      }
    }
  ]

  renderConfirmProfessional = () => (
    <Modal className={styles.modal} actions={this.modalActions}>
    Are you sure you want to create a
      <div className={styles.prof}>Professional Vlog?</div>
    Additional charges apply.
    </Modal>
  )

  render() {
    const {uploading, progress, media, overlayActive, overlayContent, closeOverlay} = this.props.vlogEditor;
    const {projectId, customEdit, toggleProperty} = this.props.project;
    const {showToast, toastContent, hamburgerActive} = this.state;
    return (
      <div className={styles.container}>
        {isEmpty(media) && this.renderHint()}
        <ProgressBar className={classNames(styles.progressBar, uploading && styles.active)} progress={progress} />
        <FontAwesome className={styles.icon} name="bars" onClick={this.toggleHamburger}/>
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
