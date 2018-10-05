import React, {Component} from 'react';
import {Segment, Input} from '../../atoms';
import {Preview} from '../../components';
import FontAwesome from 'react-fontawesome';
import {withRouter} from 'react-router';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@withRouter
@inject('vlogDetails')
@inject('vlogEditor')
@observer
export default class VlogDetails extends Component {

  componentWillUnmount() {
    this.props.vlogDetails.saveChanges();
    this.props.vlogEditor.cleanup();
  }

  editVlog = () => {
    this.props.vlogEditor.setVlog(this.props.vlogDetails.vlog);
    this.props.history.push('/edit-vlog');
  }

  renderInput = (left, right, func) =>
    <div className={styles.row}>
      <div className={styles.left}>{left}</div>
      <input className={styles.right} value={right} onChange={func}/>
    </div>

  renderInfo = (left, right, func) =>
    <div className={styles.row} {...(func && {onClick: func})}>
      <div className={styles.left}>{left}</div>
      <div className={styles.right}>{right}</div>
    </div>

  render() {
    const {vlogDetails} = this.props;
    const {vlog} = vlogDetails;
    return (
      <div className={styles.container}>
        {vlog.status === 'exported' && <Preview src={vlog.exporturl}/>}
        <Segment title="Details">
          {this.renderInput('Title', vlogDetails.title, vlogDetails.changeTitle)}
        </Segment>
        <Segment title="Actions">
          {this.renderInfo('Edit Vlog', <FontAwesome name="chevron-right"/>, this.editVlog)}
        </Segment>
      </div>
    );
  }
}
