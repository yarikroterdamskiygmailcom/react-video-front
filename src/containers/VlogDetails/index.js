import React, {Component} from 'react';
import {Segment, Icon} from '../../atoms';
import {Preview, ConfirmationPrompt, Overlay} from '../../components';
import FontAwesome from 'react-fontawesome';
import {withRouter} from 'react-router';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {assign} from 'lodash-es';
import trash from '../../../assets/trash.png';

@withRouter
@inject('vlogEditor')
@inject('project')
@observer
export default class VlogDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      overlayActive: false,
      overlayContent: null

    };
  }

  getChanges = () => {
    const properties = ['title', 'access'];
    const changes = properties.map(prop =>
      this.props.vlogDetails[prop] !== this.props.vlogDetails.vlog[prop]
        ? {[prop]: this.props.vlogDetails[prop]}
        : undefined
    ).filter(x => x);
    return assign({}, ...changes);
  }

  editVlog = () => {
    this.props.history.push('/edit-vlog');
  }

  shareWithTeam = () => {
    this.props.vlogDetails.toggleAccess();
  }

  share = () => {
    this.props.history.push('/share');
  }

  download = () => {
    window.open(this.props.vlogDetails.vlog.exporturl);
  }

  confirmDelete = () => this.setState({
    overlayActive: true,
    overlayContent: (
      <ConfirmationPrompt
        onCancel={this.closeOverlay}
        onProceed={() => this.props.project.deleteProject().then(this.props.history.push('/home'))}
        body="Are you sure you want to delete this vlog?"
      />
    )
  })

  closeOverlay = () => this.setState({
    overlayActive: false,
    overlayContent: null
  })

  renderInput = (left, right, func) =>
    <div className={styles.row}>
      <div className={styles.left}>{left}</div>
      <input className={styles.right} value={right} placeholder="Untitled" onChange={func} />
    </div>

  renderInfo = (left, right, func, noRender) =>
    <div className={styles.row} onClick={func} noRender={noRender}>
      <div className={styles.left}>{left}</div>
      <div className={styles.right}>{right}</div>
    </div>

  render() {
    const {status, access, title, exportUrl, setProperty} = this.props.project;
    const {overlayActive, overlayContent} = this.state;
    return (
      <div className={styles.container}>
        {status === 'exported' && <Preview src={exportUrl} />}
        <Segment title="Details">
          {this.renderInput('Title', title, e => setProperty('title', e.target.value))}
        </Segment>
        <Segment title="Actions">
          {this.renderInfo('Edit Vlog', <FontAwesome name="chevron-right" />, this.editVlog)}
          {this.renderInfo('Share with Team', <FontAwesome name="users" />, this.shareWithTeam, access === 'team')}
          {this.renderInfo('Share on Social Media', <FontAwesome name="share" />, this.share, !exportUrl)}
          {this.renderInfo('Download', <FontAwesome name="download" />, this.download, !exportUrl)}
        </Segment>
        <img className={styles.delete} src={trash} onClick={this.confirmDelete} />
        <Overlay active={overlayActive} onClose={this.closeOverlay}>
          {overlayContent}
        </Overlay>
      </div>
    );
  }
}
