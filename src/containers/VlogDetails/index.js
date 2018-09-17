import React, {Component} from 'react';
import {Segment} from '../../atoms';
import {Preview} from '../../components';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@inject('vlogDetails')
@observer
export default class VlogDetails extends Component {

  renderInfo = (left, right, func) =>
    <div className={styles.row} onClick={func}>
      <div className={styles.left}>{left}</div>
      <div className={styles.right}>{right}</div>
    </div>

  render() {
    console.log(this.props.vlogDetails);
    const {title} = this.props.vlogDetails;
    return (
      <div className={styles.container}>
        <Preview/>
        <Segment title="Details">
          {this.renderInfo('Title', title || 'Untitled', null)}
        </Segment>

      </div>
    );
  }
}
