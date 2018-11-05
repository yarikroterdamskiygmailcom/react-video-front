import React, {Component} from 'react';
import classNames from 'classnames';
import {Input, Toggle, Segment, Carousel, RadioButton, Icon, Checkbox} from '../../atoms';
import {Preview} from '../../components';
import {isEmpty, head, noop} from 'lodash-es';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import FontAwesome from 'react-fontawesome';
import {withRouter} from 'react-router';

@withRouter
@inject('vlogEditor')
@inject('project')
@observer
export default class ConfigureVlog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      orientation: 'landscape',
      rendering: false,
      renderUrl: null
    };
  }

  goHome = () => this.props.history.push('/home')

  share = noop

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

  toggleOrientation = () => this.setState({orientation: this.state.orientation === 'landscape' ? 'portrait' : 'landscape'})

  grabThumb = () => head(this.props.vlogEditor.media).thumb;

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

  renderVlog = () => {
    this.setState({rendering: true, renderUrl: null});
    this.props.project.saveProject()
    .then(() => this.props.project.renderProject(this.state.orientation))
    .then(res => this.setState({rendering: false, renderUrl: res.videourl}));
  }

  renderFilter = ({name, style}) => (
    <div key={name} className={classNames(styles.filter, this.props.project.filter === name && styles.active)}>
      <img
        className={styles.filterPreview}
        style={style}
        onClick={() => this.props.project.setProperty('filter', name)}
        src={this.grabThumb()}
      />
      <div className={styles.filterName}>{name}</div>
    </div>
  )

  render() {
    const {title, description, filter, logoOverlay, customSubs, customEdit, access, setProperty, toggleProperty} = this.props.project;
    const {orientation, renderUrl, rendering} = this.state;
    return (
      <div className={styles.container}>
        <Segment title="Info">
          <Input field name="Title" value={title} onChange={e => setProperty('title', e.target.value)}/>
          <Input field name="Description" value={description} onChange={e => setProperty('description', e.target.value)}/>
        </Segment>
        <Segment title="Styling">
          <Carousel className={classNames(styles.carousel, filter && styles.active)} noRender={!filter} title="Filters" items={this.filters} renderFunction={this.renderFilter} active={filter} />
          <Toggle label="Use Filter" value={filter} onChange={() => toggleProperty('filter')} />
          <Toggle label="Logo Overlay" value={logoOverlay} onChange={() => toggleProperty('logoOverlay')} />
        </Segment>
        <Segment title="Orientation">
          {this.orientationOptions.map(({render, value}) => <RadioButton key={value} render={render} active={value === orientation} onChange={this.toggleOrientation} />)}
        </Segment>
        <Segment title="Options">
          <Toggle label="Custom Subtitles" desc="Our team will add subtitles to your video (in dutch or english only)" value={customSubs} onChange={() => toggleProperty('customSubs')} />
          <Toggle label="Custom Edit" desc="A professional editor will edit your vlog!" value={customEdit} onChange={() => toggleProperty('customEdit')} />
          <Toggle label="Share with Team" desc="This vlog will be accessible to members in your team" value={access === 'team'} onChange={() => setProperty('access', access === 'team' ? 'personal' : 'team')}/>
        </Segment>
        <Segment className={classNames(styles.preview, renderUrl && styles.active)} title={renderUrl ? 'Preview' : ''}>
          {renderUrl && <Preview src={renderUrl} />}
        </Segment>
        <Segment title="Finalize">
          <div className={styles.finalize}>
            <div className={classNames(styles.renderButton, styles.active, !renderUrl && styles.invisible)} onClick={this.goHome}>
              <FontAwesome name="chevron-left"/> Home
            </div>
            <div className={classNames(styles.renderButton, !renderUrl && styles.invisible)} onClick={this.share}>
            Share!
            </div>
            <div className={classNames(styles.renderButton, !rendering && styles.active)} onClick={this.renderVlog}>
              <div>{rendering ? <FontAwesome className={styles.spinner} name="spinner"/> : 'Render'}</div>
              <FontAwesome className={styles.icon} name="chevron-right" />
            </div>
          </div>
        </Segment>
      </div>
    );
  }
}
