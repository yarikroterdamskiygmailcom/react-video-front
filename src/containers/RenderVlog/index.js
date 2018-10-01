import React, {Component} from 'react';
import {Button, Toggle, Segment} from '../../atoms';
import {Preview} from '../../components';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';
import {inject, observer} from 'mobx-react';

@inject('vlogEditor')
@inject('vlogConfig')
@inject('vlogRender')
@observer
export default class RenderVlog extends Component {

  renderEmailToggle = () => {
    const {emailMe, toggleEmailMe} = this.props.vlogRender;
    return (
      <div className={styles.row}>
        <div className={styles.stack}>
          <div className={styles.title}>Email Link</div>
          <div className={styles.desc}>Send me an email when rendering is done</div>
        </div>
        <Toggle value={emailMe} onChange={toggleEmailMe}/>
      </div>
    );
  }

  saveVlog = () => {
    const {projectId, media} = this.props.vlogEditor;
    this.props.vlogRender.saveVlog({projectId, media});
  }

  options = [
    {
      text: 'Share on Twitter',
      func: this.props.vlogRender.shareTwitter
    },
    {
      text: 'Share on Facebook',
      func: this.props.vlogRender.shareFacebook
    },
    {
      text: 'Share on Instagram',
      func: this.props.vlogRender.shareInstagram
    },
    {
      text: <a href={this.props.vlogConfig.renderUrl} target="_blank" download>Download Video</a>,
      func: this.props.vlogRender.download
    },
    {
      text: 'Email Video',
      func: this.props.vlogRender.email
    },
  ].map(({text, func}) => (
    <div className={styles.option} onClick={func}>
      <div>{text}</div>
      <FontAwesome className={styles.icon} name="chevron-right"/>
    </div>
  ))

  render() {
    const {renderUrl} = this.props.vlogConfig;
    return (
      <div className={styles.container}>
        <Preview className={styles.preview} src={renderUrl}/>
        <Segment title="Share">
          {[this.options]}
        </Segment>
      </div>
    );
  }
}
