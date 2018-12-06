import React, {Component} from 'react';
import {Toggle, Segment} from '../../atoms';
import settings from '../../constants/settings';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router';

@withRouter
@inject('settings')
@observer
export default class Settings extends Component {

  goTo = path => () => this.props.history.push(path)

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

  renderBottom = () => (
    <div className={styles.bottom}>
      <div onClick={this.goTo('/faq')}>FAQ</div>
      <div onClick={this.goTo('/about')}>About Us</div>
      <div onClick={this.goTo('/contact')}>Contact</div>
    </div>
  )

  render() {
    return (
      <div className={styles.container}>
        {settings.map(group => (
          <Segment key={group.title} title={group.title}>
            {group.settings.map(this.renderSetting)}
          </Segment>
        ))}
        {this.renderBottom()}
      </div>
    );
  }
}
