import React, {Component} from 'react';
import {Button, Toggle} from '../../atoms';
import {Preview} from '../../components';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';
import {inject, observer} from 'mobx-react';

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

  render() {
    const {previewPending, preview, aspectRatio,
      toggleAspectRatio, getPreview} = this.props.vlogRender;
    return (
      <div className={styles.container}>
        <div className={styles.title}>Preview</div>
        {preview && <Preview src={preview}/>}
        <Button fn={getPreview} text={previewPending ? 'Getting preview...' : 'Preview now'} disabled={previewPending || preview}/>
        {this.renderEmailToggle()}
        <div className={styles.row}>
          <Button highlight={aspectRatio === '16by9'} fn={toggleAspectRatio} text={<div><FontAwesome name="film"/>Landscape (16:9)</div>}/>
          <Button highlight={aspectRatio === '9by16'} fn={toggleAspectRatio} text={<div><FontAwesome name="film"/>Portrait (9:16)</div>}/>
        </div>
        <Button text="Create Vlog"/>
      </div>
    );
  }
}
