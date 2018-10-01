import React, {Component} from 'react';
import classNames from 'classnames';
import {Input, Toggle, Segment, Carousel, RadioButton, Icon} from '../../atoms';
import {Preview} from '../../components';
import {isEmpty} from 'lodash-es';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import FontAwesome from 'react-fontawesome';
import {withRouter} from 'react-router';

@withRouter
@inject('vlogConfig')
@inject('vlogEditor')
@observer
export default class ConfigureVlog extends Component {

  componentWillMount() {
    this.props.vlogConfig.init();
  }

  next = () => this.props.history.push('/render-vlog')

  orientationOptions = [
    {
      icon: 'landscape',
      option: 'Landscape Mode',
      desc: '16:9',
      value: '16:9'
    },
    {
      icon: 'portrait',
      option: 'Portrait Mode',
      desc: '9:16',
      value: '9:16'
    }
  ].map(({icon, option, desc, value}) => ({
    render: (
      <div className={styles.option}>
        <Icon className={styles.icon} name={icon}/>
        <div className={styles.optionBody}>
          <div className={styles.optionName}>{option}</div>
          <div className={styles.optionDesc}>{desc}</div>
        </div>
      </div>
    ),
    value
  })
  );

  grabThumb = () => {
    const videos = this.props.vlogEditor.media.filter(m => m.mediatype === 'video');
    return !isEmpty(videos) ? videos[0].thumb : 'https://i.imgur.com/bLgcS46.jpg';
  }

  filters = [
    {
      name: 'sepia',
      style: {
        filter: 'sepia(1)'
      }
    },
    {
      name: 'grayscale',
      style: {
        filter: 'grayscale(1)'
      }
    },
    {
      name: 'film',
      style: {
        filter: 'grayscale(6%) contrast(130%)',
        mixBlendMode: 'hard-light'
      }
    },
    {
      name: 'noon',
      style: {
        filter: 'grayscale(30%) contrast(140%) hue-rotate(-5deg)',
        mixBlendMode: 'hard-light'
      }
    },
    {
      name: 'desaturate',
      style: {
        filter: 'contrast(1.2) saturate(0.5)'
      }
    }
  ]

  renderFilter = ({name, style}) => <img
    className={classNames(styles.filter, this.props.vlogConfig.filter === name && styles.active)}
    style={style}
    onClick={this.props.vlogConfig.setFilter(name)}
    src={this.grabThumb()}
  />

  renderInput = (label, value, onChange) => (
    <div className={styles.spacedRow}>
      <div className={styles.label}>{label}</div>
      <input type="text" value={value} onChange={onChange}/>
    </div>
  )

  render() {
    const {vlogTitle, vlogDescription, filter, useFilter, orientation, customSubs, customEdit,
      changeVlogTitle, changeVlogDescription, toggleFilter, toggleOrientation, toggleSubs, toggleEdit,
      renderVlog, rendering, renderUrl} = this.props.vlogConfig;
    return (
      <div className={styles.container}>
        <Segment title="Info">
          {this.renderInput('Title', vlogTitle, changeVlogTitle)}
          {this.renderInput('Description', vlogDescription, changeVlogDescription)}
        </Segment>
        <Segment title="Styling">
          <Carousel title="Filters" items={this.filters} renderFunction={this.renderFilter} active={filter}/>
          <Toggle label="Logo Overlay" value={useFilter} onChange={toggleFilter}/>
        </Segment>
        <Segment title="Orientation">
          {this.orientationOptions.map(({render, value}) => <RadioButton render={render} active={value === orientation} onChange={toggleOrientation}/>)}
        </Segment>
        <Segment title="Options">
          <Toggle label="Custom Subtitles" desc="Our team will add subtitles to your video (in dutch or english only)" value={customSubs} onChange={toggleSubs}/>
          <Toggle label="Custom Edit" desc="A professional editor will edit your vlog!" value={customEdit} onChange={toggleEdit}/>
        </Segment>
        {renderUrl && <Segment title="Preview">
          <Preview className={styles.preview} src={renderUrl}/>
        </Segment>}
        <div className={styles.renderSection}>
          {renderUrl && <div className={styles.renderButton} onClick={this.next}>
            Share!
          </div>}
          <div className={classNames(styles.renderButton, rendering && styles.active)} onClick={renderVlog}>
            <div>{rendering ? 'Rendering...' : 'Render'}</div>
            <FontAwesome className={styles.icon} name="chevron-right"/>
          </div>
        </div>
      </div>
    );
  }
}
