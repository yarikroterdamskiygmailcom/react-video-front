import React, {Component} from 'react';
import {Button, Toggle} from '../../atoms';
import {Preview} from '../../components';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';
import {inject, observer} from 'mobx-react';

@inject('session')
@inject('vlogEditor')
@inject('vlogRender')
@observer
export default class RenderVlog extends Component {

  componentWillMount() {
    this.props.vlogRender.setSessionId(this.props.session.sessionId);
  }

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

  render() {
    const {previewPending, preview, aspectRatio,
      toggleAspectRatio, getPreview} = this.props.vlogRender;
    return (
      <div className={styles.container}>
        <div className={styles.title}>Preview</div>
        {preview && <Preview src={preview}/>}
        <Button onClick={getPreview} text={previewPending ? 'Getting preview...' : 'Preview now'} disabled={previewPending || preview}/>
        {this.renderEmailToggle()}
        <div className={styles.row}>
          <Button highlight={aspectRatio === '16by9'} onClick={toggleAspectRatio} text={<div><FontAwesome name="film"/>Landscape (16:9)</div>}/>
          <Button highlight={aspectRatio === '9by16'} onClick={toggleAspectRatio} text={<div><FontAwesome name="film"/>Portrait (9:16)</div>}/>
        </div>
        <Button text="Create Vlog" onClick={this.saveVlog}/>
      </div>
    );
  }
}
