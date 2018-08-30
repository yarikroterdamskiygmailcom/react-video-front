import React, {Component} from 'react';
import {Input, Toggle} from '../../atoms';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import FontAwesome from 'react-fontawesome';
import {withRouter} from 'react-router';

@withRouter
@inject('vlogConfig')
@observer
export default class ConfigureVlog extends Component {

  componentWillMount() {
    this.props.vlogConfig.init();
  }

  toggleRows = () => {
    const {logoOverlay, subtitles, edit, setLogoOverlay, setSubtitles, setEdit} = this.props.vlogConfig;
    return [
      {
        toggle: <Toggle value={logoOverlay} onChange={setLogoOverlay}/>,
        title: 'Logo Overlay',
        desc: 'Brand your vlog with a small burned-in logo'
      },
      {
        toggle: <Toggle value={subtitles} onChange={setSubtitles}/>,
        title: 'Custom Subtitles',
        desc: 'Our team subtitles your video perfectly (excluding translation)'
      },
      {
        toggle: <Toggle value={edit} onChange={setEdit}/>,
        title: 'Custom Edit',
        desc: 'Our team of specialists edits your vlog!'
      }
    ];
  }

  renderToggleRow = ({toggle, title, desc}, i) => (
    <div key={i}>
      <div className={styles.stack}>
        <div className={styles.title}>{title}</div>
        <div className={styles.desc}>{desc}</div>
      </div>
      {toggle}
    </div>
  )

  renderColorFilter = () => {
    const {useColorFilter, colorFilter, setUseColorFilter, setColorFilter} = this.props.vlogConfig;
    return (
      <div>
        <div className={styles.stack}>
          <div className={styles.title}>Use color filter?</div>
          <div className={styles.desc}>Overlay your vlog with a color filter</div>
        </div>
        <Toggle value={useColorFilter} onChange={setUseColorFilter}/>
        {useColorFilter && <input type="color" value={colorFilter} onChange={setColorFilter}/>}

      </div>
    );
  }

  next = () => this.props.history.push('/render-vlog')

  render() {
    const {
      title, desc,
      setTitle, setDesc,
    } = this.props.vlogConfig;
    return (
      <div className={styles.container}>
        <Input fieldName="Title" nameTop value={title} onChange={setTitle}/>
        <Input fieldName="Description" nameTop value={desc} onChange={setDesc}/>
        {this.renderColorFilter()}
        {this.toggleRows().map(this.renderToggleRow)}
        <FontAwesome className={styles.next} name="angle-right" onClick={this.next}/>
      </div>
    );
  }
}
