import React, {Component} from 'react';
import styles from './styles.scss';

export default class Slider extends Component {
  render() {
    const {min, max, step, value, onChange} = this.props;
    return (
      <div className={styles.container}>
        <div>{this.props.label}</div>
        <input type="range" min={min} max={max} step={step} value={value} onChange={onChange}/>
        <div>{value}</div>
      </div>
    );
  }
}
