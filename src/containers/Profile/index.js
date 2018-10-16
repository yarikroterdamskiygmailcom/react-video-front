import React, {Component} from 'react';
import {isEmpty, noop} from 'lodash-es';
import styles from './styles.scss';
import {ProgressBar} from '../../atoms';
import {observer, inject} from 'mobx-react';
import classNames from 'classnames';
import {Overlay, Preview, Modal} from '../../components';
import {withRouter} from 'react-router';
import FontAwesome from 'react-fontawesome';

@withRouter
@inject('session')
@inject('profile')
@inject('assets')
@observer
export default class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      activeAsset: null
    };
  }

  componentWillMount() {
    this.props.profile.loadProfile();
    this.props.assets.loadAssets();
  }

  componentDidMount() {
    this.props.assets.initResumable();
  }

  openAsset = i => () => {
    this.setState({
      isOpen: true,
      activeAsset: i
    });
  }

  closeOverlay = () => this.setState({
    isOpen: false,
  })

  goToCustomize = () => this.props.history.push('/customize')

  renderField = (left, right, func) => (
    <div className={styles.field} onClick={func || noop}>
      <div className={styles.fieldLeft}>{left}</div>
      <div className={styles.fieldRight}>{right}</div>
    </div>
  )

  renderPersona = () => {
    const {first_name, last_name, team} = this.props.profile.user;
    return (
      <div className={styles.persona}>
        <div className={styles.avatar} />
        <div className={styles.fullName}>{`${first_name} ${last_name}`}</div>
        <div className={styles.companyName}>{team}</div>
      </div>
    );
  }

  renderFields = () => {
    const {email, team} = this.props.profile.user;
    return (
      <div className={styles.fields}>
        {this.renderField('E-mail', email)}
        {this.renderField('Account Type', team ? 'Team' : 'Personal')}
        {this.renderField('Customize', <FontAwesome className={styles.icon} name="chevron-right"/>, this.goToCustomize)}
      </div>
    );
  }

  renderAsset = ({id, thumb, title}, i) => (
    <div key={id} className={styles.asset} onClick={this.openAsset(i)}>
      <img
        className={styles.thumb}
        src={thumb}
      />
      <div className={styles.assetTitle}>{title}</div>
    </div>
  )

  renderAssets = () => {
    const {assetList, uploading, progress} = this.props.assets;
    return (
      <div className={styles.assets}>
        <div className={styles.assetsHeader}>
          <div>Assets</div>
          <div className={styles.upload} id="addAsset">Upload +</div>
        </div>
        <ProgressBar className={classNames(styles.progressBar, uploading && styles.active)} progress={progress}/>
        <div className={styles.assetList}>
          {!isEmpty(assetList) ? assetList.map(this.renderAsset) : 'You havent added any assets yet'}
        </div>
      </div>
    );
  }

  deleteAsset = id => () => this.props.assets.deleteAsset(id).then(this.closeOverlay)

  renderPreview = () => {
    if (this.state.activeAsset === null) {return null;}
    const asset = this.props.assets.assetList[this.state.activeAsset];
    const modalActions = [
      {
        label: 'Close',
        func: this.closeOverlay
      },
      {
        label: 'Delete',
        func: this.deleteAsset(asset.id)
      }
    ];
    return (
      <Modal className={styles.modal} actions={modalActions}>
        <Preview src={asset.src} />
      </Modal>
    );
  }

  render() {
    const {user} = this.props.profile;
    const {isOpen} = this.state;
    return (
      <div className={styles.container}>
        {user && this.renderPersona()}
        {user && this.renderFields()}
        {this.renderAssets()}
        <Overlay active={isOpen} onClose={this.closeOverlay}>
          {isOpen && this.renderPreview()}
        </Overlay>
      </div>
    );
  }
}
