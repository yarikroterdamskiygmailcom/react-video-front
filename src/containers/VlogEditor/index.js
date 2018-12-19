import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router';
import {Arranger, Toolbar, Hamburger, ConfirmProfessional, EditTitle, EditFade, SelectAsset} from '../../components';
import classNames from 'classnames';
import styles from './styles.scss';
import {ProgressBar, Icon, Toggle, Segment} from '../../atoms';
import {isEmpty, noop} from 'lodash-es';
import FontAwesome from 'react-fontawesome';

@withRouter
@inject('overlay')
@inject('vlogEditor')
@inject('project')
@observer
export default class VlogEditor extends Component {
  constructor(props) {
    super(props);
    this.resumableRef = React.createRef();
    this.state = {
      pending: false,
      hamburgerActive: false,
      syncing: false
    };
  }

  // componentDidMount() {
  //   this.props.vlogEditor.initResumable();
  //   this.resumableRef.current.children[0].accept = 'video/*';
  // }

  componentWillUnmount() {
    this.props.project.updateProject({
      media: JSON.stringify(this.props.vlogEditor.media.toJS().map(this.props.project.reduceMediaObj))
    });
  }

  confirmProfessional = () => {
    this.props.overlay.openOverlay(ConfirmProfessional)({onSelect: () => {
      this.props.project.toggleProperty('customEdit');
    }});
  }

  toggleHamburger = () => this.setState({hamburgerActive: !this.state.hamburgerActive})

  sync = () => this.props.vlogEditor.syncMedia();

  getActions = () => [
    {
      icon: 'video',
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
      fn: this.props.overlay.openOverlay(EditFade)({onSave: this.props.vlogEditor.addMedia})
    },
    {
      icon: 'title',
      render: <div>Title</div>,
      fn: this.props.overlay.openOverlay(EditTitle)({onSave: this.props.vlogEditor.addMedia})
    },
    {
      icon: 'asset',
      render: <div>Branding</div>,
      fn: this.props.overlay.openOverlay(SelectAsset)({onSave: this.props.vlogEditor.addMedia})
    }
  ]

  nextStep = () => {
    if (this.props.vlogEditor.getErrors()) {
      this.props.Overlay.showToast(this.props.vlogEditor.getErrors());
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
    const {uploading, progress, media, syncing} = this.props.vlogEditor;
    const {projectId, customEdit, toggleProperty} = this.props.project;
    const {hamburgerActive} = this.state;
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
