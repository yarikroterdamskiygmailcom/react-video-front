import React, {Component} from 'react';
import {Toggle} from '../../atoms';
import settings from '../../constants/settings';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@inject('settings')
@observer
export default class Settings extends Component {

  toggle = key => () => this.props.settings.toggle(key)

  renderSetting = setting =>
    <div key={setting.storeKey} className={styles.setting}>
      <Toggle
        label={setting.name}
        desc={setting.desc}
        value={this.props.settings.settings[setting.storeKey]}
        onChange={this.toggle(setting.storeKey)}
      />
    </div>

  renderSegment = segment =>
    <div key={segment.title} className={styles.segment}>
      <div className={styles.segmentTitle}>{segment.title}</div>
      {segment.settings.map(this.renderSetting)}
    </div>

  render() {
    return (
      <div className={styles.container}>
        {settings.map(this.renderSegment)}
      </div>
    );
  }
}
