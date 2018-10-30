import React, {Component} from 'react';
import {Segment, Input} from '../../atoms';
import {Preview} from '../../components';
import FontAwesome from 'react-fontawesome';
import {withRouter} from 'react-router';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {assign} from 'lodash-es';

@withRouter
@inject('vlogDetails')
@inject('vlogEditor')
@observer
export default class VlogDetails extends Component {

  componentWillUnmount() {
    this.props.vlogDetails.saveChanges(this.getChanges());
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
    this.props.vlogEditor.setVlog(this.props.vlogDetails.vlog);
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

  renderInput = (left, right, func) =>
    <div className={styles.row}>
      <div className={styles.left}>{left}</div>
      <input className={styles.right} value={right} placeholder="Untitled" onChange={func}/>
    </div>

  renderInfo = (left, right, func, noRender) =>
    <div className={styles.row} onClick={func} noRender={noRender}>
      <div className={styles.left}>{left}</div>
      <div className={styles.right}>{right}</div>
    </div>

  render() {
    const {vlogDetails} = this.props;
    const {vlog} = vlogDetails;
    console.log(this.props.vlogDetails.vlog);
    return (
      <div className={styles.container}>
        {vlog.status === 'exported' && <Preview src={vlog.exporturl}/>}
        <Segment title="Details">
          {this.renderInput('Title', vlogDetails.title, vlogDetails.changeTitle)}
        </Segment>
        <Segment title="Actions">
          {this.renderInfo('Edit Vlog', <FontAwesome name="chevron-right"/>, this.editVlog)}
          {this.renderInfo('Share with Team', <FontAwesome name="users"/>, this.shareWithTeam, vlog.access === 'team')}
          {this.renderInfo('Share on Social Media', <FontAwesome name="share"/>, this.share, !vlog.exporturl)}
          {this.renderInfo('Download', <FontAwesome name="download"/>, this.download, !vlog.exporturl)}
        </Segment>
      </div>
    );
  }
}
