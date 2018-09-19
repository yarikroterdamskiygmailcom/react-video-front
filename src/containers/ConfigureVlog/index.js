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

  next = () => this.props.history.push('/render-vlog')

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
    const {orientation, toggleOrientation, renderVlog} = this.props.vlogConfig;
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
        <div className={styles.renderSection}>
          <div className={styles.renderButton} onClick={this.next}>
            <div>Render</div>
            <FontAwesome name="chevron-right"/>
          </div>
        </div>
      </div>
    );
  }
}
