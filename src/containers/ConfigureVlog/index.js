import React, {Component} from 'react';
import classNames from 'classnames';
import {Input, Toggle, Segment, Carousel, RadioButton, Icon} from '../../atoms';
import {Preview} from '../../components';
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

  // render() {
  //   const {
  //     title, desc,
  //     setTitle, setDesc,
  //   } = this.props.vlogConfig;
  //   return (
  //     <div className={styles.container}>
  //       <Input fieldName="Title" nameTop value={title} onChange={setTitle}/>
  //       <Input fieldName="Description" nameTop value={desc} onChange={setDesc}/>
  //       {this.renderColorFilter()}
  //       {this.toggleRows().map(this.renderToggleRow)}
  //       <FontAwesome className={styles.next} name="angle-right" onClick={this.next}/>
  //     </div>
  //   );
  // }

  orientationOptions = [
    {
      icon: 'landscape',
      option: 'Portrait Mode',
      desc: '16:9',
      value: '16:9'
    },
    {
      icon: 'portrait',
      option: 'Landscape Mode',
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

  filters = ['#777777', '#333333', '#777777', '#333333', '#777777', '#333333', '#777777', '#333333', '#777777', '#333333']

  renderFilter = filter => <div className={styles.filter} style={{background: filter}}/>

  renderInput = (label, value, onChange) => (
    <div className={styles.spacedRow}>
      <div className={styles.label}>{label}</div>
      <input type="text" value={value} onChange={onChange}/>
    </div>
  )

  render() {
    const vlogTitle = 'kaas';
    const vlogDescription = 'kaas';
    const changeVlogTitle = () => null;
    const changeVlogDescription = () => null;
    const {orientation, toggleOrientation} = this.props.vlogConfig;
    return (
      <div className={styles.container}>
        <Segment title="Info">
          {this.renderInput('Title', vlogTitle, changeVlogTitle)}
          {this.renderInput('Description', vlogDescription, changeVlogDescription)}
        </Segment>
        <Segment title="Styling">
          <Carousel title="Filters" items={this.filters} renderFunction={this.renderFilter}/>
          <Toggle label="Logo Overlay"/>
        </Segment>
        <Segment title="Orientation">
          {this.orientationOptions.map(({render, value}) => <RadioButton render={render} active={value === orientation} onChange={toggleOrientation}/>)}
        </Segment>
        <Segment title="Options">
          <Toggle label="Custom Subtitles" desc="Lorem Ipsum"/>
          <Toggle label="Custom Edit" desc="Lorem Ipsum"/>
        </Segment>
        <Segment title="Preview">
          <Preview/>
        </Segment>
        <div className={styles.renderSection}>
          <div className={styles.renderButton}><div>Render</div><FontAwesome name="chevron-right"/></div>
        </div>
      </div>
    );
  }
}
