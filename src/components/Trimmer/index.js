import React, {Component} from 'react';
import {Button} from '../../atoms';
import {Modal} from '..';
import styles from './styles.scss';
import {Range} from 'rc-slider';
import classNames from 'classnames';
import '!style-loader!css-loader!rc-slider/assets/index.css';

export default class Trimmer extends Component {

  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentWillMount() {
    const {video} = this.props;
    const vidLength = parseFloat(video.seconds);
    this.setExtremes(0, vidLength);
    if (video.trimmed) {
      this.setTrim([video.inpoint, video.outpoint]);
    } else {
      this.setTrim([0, vidLength]);
    }
  }

  setTrim = values => this.setState({start: values[0], stop: values[1]})

  setExtremes = (min, max) => this.setState({min, max})

  saveTrim = () => {
    this.props.video.inpoint = this.state.start;
    this.props.video.outpoint = this.state.stop;
    this.props.video.trimmed = true;
    this.props.onClose();
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

  render() {
    const {video, noModal, lowerThird} = this.props;
    const {start, stop, min, max} = this.state;
    const content = (
      <React.Fragment>
        <div className={styles.videoContainer}>
          <video className={styles.video} ref={this.videoRef} src={video.src} autoPlay />
          {lowerThird && <img className={classNames(styles.lowerThird, styles[lowerThird.side])} src={lowerThird.path}/>}
        </div>
        <Button onClick={this.preview} text="Preview" />
        <div className={styles.timestamps}>
          <div>{start}</div>
          <div>{stop}</div>
        </div>
        <Range
          value={[start, stop]}
          onChange={this.setTrim}
          min={min}
          max={max}
          step={0.01}
          allowCross={false}
        />
      </React.Fragment>
    );
    return noModal
      ? content
      : <Modal actions={this.actions}>{content}</Modal>;
  }
}
