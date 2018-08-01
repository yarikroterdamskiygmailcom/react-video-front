import React, {Component} from 'react';
import {Toggle} from '..';
import settings from '../../constants/settings';
import styles from './styles.scss';

export default class Settings extends Component {

    renderSetting = setting =>
      <div className={styles.setting}>
        <div className={styles.left}>
          <div className={styles.settingName}>{setting.name}</div>
          <div className={styles.settingDescription}>{setting.description}</div>
        </div>
        <Toggle/>
      </div>

    renderSegment = segment =>
      <div className={styles.segment}>
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
