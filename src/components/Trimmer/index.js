import React, {Component} from 'react';
import {Modal} from '..';
import styles from './styles.scss';
import {Range} from '../../atoms';
import FontAwesome from 'react-fontawesome';

export default class Trimmer extends Component {

  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.state = {
      start: props.video.inpoint,
      stop: props.video.outpoint
    };
  }

  componentDidMount() {
    this.props.onChange(this.state.start, this.state.stop);
  }

  setTrim = ([start, stop]) => {
    const lastChanged = start === this.state.start ? 'stop' : 'start';
    this.videoRef.current.currentTime = lastChanged === 'start' ? start : stop;
    this.setState({
      start,
      stop,
    }, this.props.onChange(start, stop));
  }

  pause = () => this.videoRef.current.pause()

  play = () => {
    this.videoRef.current.currentTime = this.state.start;
    this.videoRef.current.play();
  }

  limitVideo = e => e.target.currentTime >= this.state.stop && this.pause()

  render() {
    const {video} = this.props;
    const {start, stop} = this.state;
    const max = video.seconds;
    return (
      <React.Fragment>
        <div className={styles.videoContainer}>
          <video className={styles.video} ref={this.videoRef} src={video.src} playsInline autoPlay onTimeUpdate={this.limitVideo}/>
          {this.props.children}
        </div>
        <div className={styles.controls}>
          <FontAwesome name="pause" onClick={this.pause}/>
          <FontAwesome name="play" onClick={this.play}/>
        </div>
        <Range value={[start, stop]} limits={[0, max]} onChange={this.setTrim}/>
      </React.Fragment>
    );
  }
}
