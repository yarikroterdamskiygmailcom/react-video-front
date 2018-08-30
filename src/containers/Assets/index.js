import React, {Component} from 'react';
import {Button} from '../../atoms';
import {isEmpty} from 'lodash-es';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@inject('assets')
@inject('session')
@observer
export default class Assets extends Component {

  componentWillMount() {
    this.loadAssets();
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

    loadAssets = () => this.props.assets.loadAssets(this.props.session.sessionId)

    render() {
      const {assetList} = this.props.assets;
      return (
        <div className={styles.container}>
          <Button text="Add asset..."fn={this.addAsset}/>
          <div className={styles.header}>My Assets</div>
          {!isEmpty(assetList) ? assetList.map(this.renderAsset) : 'You havent added any assets yet'}
        </div>
      );
    }
}
