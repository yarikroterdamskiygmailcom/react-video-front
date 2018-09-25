import React, {Component} from 'react';
import {Segment} from '../../atoms';
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

  openVlog = () => {
    this.props.vlogEditor.setVlog(this.props.vlogDetails.vlog);
    this.props.history.push('/edit-vlog');
  }

  renderInfo = (left, right, func) =>
    <div className={styles.row} {...(func && {onClick: func})}>
      <div className={styles.left}>{left}</div>
      <div className={styles.right}>{right}</div>
    </div>

  render() {
    const vlog = this.props.vlogDetails;
    return (
      <div className={styles.container}>
        {vlog.status === 'exported' && <Preview src={vlog.exporturl}/>}
        <Segment title="Details">
          {this.renderInfo('Title', vlog.title || 'Untitled', null)}
        </Segment>
        <Segment title="Actions">
          {this.renderInfo('Edit Vlog', <FontAwesome name="chevron-right"/>, this.openVlog)}
        </Segment>
      </div>
    );
  }
}
