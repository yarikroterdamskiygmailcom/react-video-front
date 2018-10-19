import React, {Component} from 'react';
import classNames from 'classnames';
import {Input, Toggle, Segment, Carousel, RadioButton, Icon, Checkbox} from '../../atoms';
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
      desc: 'Landscape',
      value: 'landscape'
    },
    {
      icon: 'portrait',
      option: 'Portrait Mode',
      desc: 'Portrait',
      value: 'portrait'
    }
  ].map(({icon, option, desc, value}) => ({
    render: (
      <div className={styles.option}>
        <Icon className={styles.icon} name={icon} />
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

  renderFilter = ({name, style}) => (
    <div key={name} className={classNames(styles.filter, this.props.vlogConfig.filter === name && styles.active)}>
      <img
        className={styles.filterPreview}
        style={style}
        onClick={this.props.vlogConfig.setFilter(name)}
        src={this.grabThumb()}
      />
      <div className={styles.filterName}>{name}</div>
    </div>
  )

  renderInput = (label, value, onChange) => (
    <div className={styles.spacedRow}>
      <div className={styles.label}>{label}</div>
      <input className={styles.input} type="text" value={value} onChange={onChange} />
    </div>
  )

  render() {
    const {vlogTitle, vlogDescription, filter, useFilter, useLogoOverlay, orientation, customSubs, customEdit, shareWithTeam,
      changeVlogTitle, changeVlogDescription, toggleFilter, toggleLogoOverlay, toggleOrientation, toggleSubs, toggleEdit, toggleShareWithTeam,
      renderVlog, rendering, renderUrl} = this.props.vlogConfig;
    return (
      <div className={styles.container}>
        <Segment title="Info">
          {this.renderInput('Title', vlogTitle, changeVlogTitle)}
          {this.renderInput('Description', vlogDescription, changeVlogDescription)}
        </Segment>
        <Segment title="Styling">
          <Carousel className={classNames(styles.carousel, useFilter && styles.active)} noRender={!useFilter} title="Filters" items={this.filters} renderFunction={this.renderFilter} active={filter} />
          <Toggle label="Use Filter" value={useFilter} onChange={toggleFilter} />
          <Toggle label="Logo Overlay" value={useLogoOverlay} onChange={toggleLogoOverlay} />
        </Segment>
        <Segment title="Orientation">
          {this.orientationOptions.map(({render, value}) => <RadioButton key={value} render={render} active={value === orientation} onChange={toggleOrientation} />)}
        </Segment>
        <Segment title="Options">
          <Toggle label="Custom Subtitles" desc="Our team will add subtitles to your video (in dutch or english only)" value={customSubs} onChange={toggleSubs} />
          <Toggle label="Custom Edit" desc="A professional editor will edit your vlog!" value={customEdit} onChange={toggleEdit} />
          <Toggle label="Share with Team" desc="This vlog will be accessible to members in your team" value={shareWithTeam} onChange={toggleShareWithTeam}/>
        </Segment>
        {renderUrl && <Preview className={styles.preview} src={renderUrl} />}
        <Segment title="Finalize">
          <div className={styles.row}>
            <div className={classNames(styles.renderButton, renderUrl && styles.active)} onClick={this.next}>
            Share!
            </div>
            <div className={classNames(styles.renderButton, !rendering && styles.active)} onClick={renderVlog}>
              <div>{rendering ? 'Rendering...' : 'Render'}</div>
              <FontAwesome className={styles.icon} name="chevron-right" />
            </div>
          </div>
        </Segment>
      </div>
    );
  }
}
