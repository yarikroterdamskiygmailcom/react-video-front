import React, {Component} from 'react';
import {Button, Slider} from '../../atoms';
import {Modal} from '..';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {Range} from 'rc-slider';
import '!style-loader!css-loader!rc-slider/assets/index.css';

// @inject('vlogEditor')
// @observer
export default class Trimmer extends Component {

  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.state = {
      start: 0,
      stop: 0
    };
  }

  componentWillMount() {
    const {video} = this.props;
    if(video.trimmed) {
      this.setTrim(video.inpoint, video.outpoint);
    }
  }

  setTrim = ([start, stop]) => this.setState({start, stop})

  saveTrim = () => {
    this.video.inpoint = this.state.start;
    this.video.outpoint = this.state.stop;
    this.video.trimmed = true;
  }

  actions = [
    {
      label: 'Cancel',
      func: this.props.onClose
    },
    {
      label: 'Trim',
      func: this.saveTrim
    }
  ]

  preview = () => {
    const {start, stop} = this.state;
    setTimeout(() => this.videoRef.current.pause(), (stop - start) * 1000);
    this.videoRef.current.currentTime = start;
    this.videoRef.current.play();
  }

  initStopTime = () => this.setState({stop: !this.state.stop && this.videoRef.current.duration});

  render() {
    const {video} = this.props;
    const {start, stop} = this.state;
    return (
      <Modal className={styles.modal} actions={this.actions}>
        <video className={styles.video} ref={this.videoRef} src={video.src} autoPlay onLoadedMetadata={this.initStopTime}/>
        <Button onClick={this.preview} text="Preview"/>
        <div className={styles.timestamps}>
          <div>{start}</div>
          <div>{stop}</div>
        </div>
        <Range
          value={[start, stop]}
          onChange={this.setTrim}
          min={0}
          max={video.vidtime}
          step={0.01}
          allowCross={false}
        />
      </Modal>
    );
  }
}
