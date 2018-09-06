import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import {isEmpty} from 'lodash-es';
import styles from './styles.scss';
import {Input, Button} from '../../atoms';
import {observer, inject} from 'mobx-react';

@inject('session')
@inject('profile')
@inject('assets')
@observer
export default class Profile extends Component {

  componentWillMount() {
    this.props.assets.loadAssets();
  }

  componentDidMount() {
    this.props.assets.initResumable();
  }

  renderField = (left, right, func) => (
    <div className={styles.field} onClick={func}>
      <div className={styles.fieldLeft}>{left}</div>
      <div className={styles.fieldRight}>{right}</div>
    </div>
  )

  renderPersona = () => {
    const {fullName, companyName, email} = this.props.profile;
    return (
      <div className={styles.persona}>
        <div className={styles.avatar}/>
        <div className={styles.fullName}>{fullName}</div>
        <div className={styles.companyName}>{companyName}</div>
      </div>
    );
  }

  renderFields = () => {
    const {email, accountType} = this.props.profile;
    return (
      <div className={styles.fields}>
        {this.renderField('E-mail', email)}
        {this.renderField('Account Type', accountType)}
        {this.renderField('Payment Info', <FontAwesome name="chevron-right"/>)}
      </div>
    );
  }

  renderAsset = ({id, thumb, title}) => (
    <div key={id} className={styles.asset}>
      <div className={styles.thumb} style={{background: `url(${thumb})`}}/>
      <div className={styles.assetTitle}>{title}</div>
    </div>
  )

  renderAssets = () => {
    const {assetList, uploading} = this.props.assets;
    return (
      <div className={styles.assets}>
        <div className={styles.assetsHeader}>
          <div>Assets</div>
          <div className={styles.upload} id="addAsset">Upload +</div>
        </div>
        <div className={styles.assetList}>
          {!isEmpty(assetList) ? assetList.map(this.renderAsset) : 'You havent added any assets yet'}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderPersona()}
        {this.renderFields()}
        {this.renderAssets()}
      </div>
    );
  }
}
