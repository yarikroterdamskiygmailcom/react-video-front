import React, {Component} from 'react';
import classNames from 'classnames';
import {Input, Toggle, Segment, Carousel, ButtonGroup} from '../../atoms';
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
      icon: 'mobile',
      option: 'Portrait Mode',
      desc: '16:9',
      value: '16:9'
    },
    {
      icon: 'mobile',
      option: 'Landscape Mode',
      desc: '9:16',
      value: '9:16'
    }
  ].map(({icon, option, desc, value}) => ({
    render: (
      <div className={styles.option}>
        <FontAwesome className={classNames(styles.icon, value === '9:16' && styles.rotate)} name={icon}/>
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

  renderFilter = filter => (
    <div className={styles.filter} style={{background: filter}}>

    </div>
  )

  renderInput = (label, value, onChange) => (
    <div className={styles.spacedRow}>
      <div className={styles.label}>{label}</div>
      <input type="text" value={value} onChange={onChange}/>
    </div>
  )

  renderPaymentInfo = () => (
    <div className={styles.spacedRow}>
      <div>Payment Info</div>
      <FontAwesome name="chevron-right" style={{color: '#D1D1D6'}}/>
    </div>
  )

  render() {
    const orientation = '16:9';
    const vlogTitle = 'kaas';
    const vlogDescription = 'kaas';
    const changeVlogTitle = () => null;
    const changeVlogDescription = () => null;
    return (
      <div className={styles.container}>
        <Segment title="Info">
          {this.renderInput('Title', vlogTitle, changeVlogTitle)}
          {this.renderInput('Description', vlogDescription, changeVlogDescription)}
          {this.renderPaymentInfo()}
        </Segment>
        <Segment title="Styling">
          <Carousel title="Filters" items={this.filters} renderFunction={this.renderFilter}/>
          <Toggle label="Logo Overlay"/>
        </Segment>
        <Segment title="Orientation">
          <ButtonGroup options={this.orientationOptions} value={orientation} onChange={() => null}/>
        </Segment>
        <Segment title="Options">
          <Toggle label="Custom Subtitles"/>
          <Toggle label="Custom Edit"/>
        </Segment>
        <Segment title="Preview">
          <Preview/>
        </Segment>
      </div>
    );
  }
}
