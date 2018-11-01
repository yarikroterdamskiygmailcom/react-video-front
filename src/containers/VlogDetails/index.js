import React, {Component} from 'react';
import {Segment, Icon} from '../../atoms';
import {Preview, ConfirmationPrompt, Overlay} from '../../components';
import FontAwesome from 'react-fontawesome';
import {withRouter} from 'react-router';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {assign, isEmpty, noop} from 'lodash-es';
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

  editVlog = () => {
    this.props.history.push('/edit-vlog');
  }

  share = () => {
    this.props.history.push('/share');
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

  renderInput = (left, right, func, onBlur) =>
    <div className={styles.row}>
      <div className={styles.left}>{left}</div>
      <input className={styles.right} value={right} placeholder="Nothing" onChange={func} onBlur={onBlur}/>
    </div>

  renderInfo = (left, right, func, noRender) =>
    <div className={styles.row} onClick={func || noop} noRender={noRender}>
      <div className={styles.left}>{left}</div>
      <div className={styles.right}>{right}</div>
    </div>

  render() {
    const {
      title, updateTitle,
      description, updateDescription,
      status, access,
      exportUrl, download, shareWithTeam, setProperty
    } = this.props.project;
    const {overlayActive, overlayContent} = this.state;
    return (
      <div className={styles.container}>
        {status === 'exported' && <Preview src={exportUrl} />}
        <Segment title="Details">
          {this.renderInput('Title', title, e => setProperty('title', e.target.value), updateTitle)}
          {this.renderInput('Description', description, e => setProperty('description', e.target.value), updateDescription)}
          {this.renderInfo('Shared with Team', access === 'team' ? 'Yes' : 'No')}
        </Segment>
        <Segment title="Actions">
          {this.renderInfo('Edit Vlog', <FontAwesome name="chevron-right" />, this.editVlog)}
          {this.renderInfo('Share with Team', <FontAwesome name="users" />, shareWithTeam, access === 'team')}
          {this.renderInfo('Share on Social Media', <FontAwesome name="share" />, this.share, !exportUrl)}
          {this.renderInfo('Download', <FontAwesome name="download" />, download, !exportUrl)}
        </Segment>
        <img className={styles.delete} src={trash} onClick={this.confirmDelete} />
        <Overlay active={overlayActive} onClose={this.closeOverlay}>
          {overlayContent}
        </Overlay>
      </div>
    );
  }
}
