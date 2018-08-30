import React, {Component} from 'react';
import {isEmpty} from 'lodash-es';
import classNames from 'classnames';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@inject('assets')
@inject('session')
@observer
export default class Assets extends Component {

  componentWillMount() {
    this.props.assets.setSessionId(this.props.session.sessionId);
    this.props.assets.loadAssets();
  }

  componentDidMount() {
    this.props.assets.initResumable();
  }

    renderAsset = ({id, thumb, title, type}) => (
      <div key={id} className={styles.asset}>
        <div className={styles.thumb} style={{background: `url(${thumb})`}}/>
        <div className={styles.assetData}>
          <div className={styles.assetTitle}>{title}</div>
          <div className={styles.assetType}>{type}</div>
        </div>
      </div>
    )

    render() {
      const {uploading, assetList} = this.props.assets;
      return (
        <div className={styles.container}>
          {uploading && <div>UPLOADING</div>}
          <div className={classNames(styles.input, uploading && styles.invisible)} id="addAsset">Add asset...</div>
          <div className={styles.header}>My Assets</div>
          {!isEmpty(assetList) ? assetList.map(this.renderAsset) : 'You havent added any assets yet'}
        </div>
      );
    }
}
