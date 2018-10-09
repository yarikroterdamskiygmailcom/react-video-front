import React, {Component} from 'react';
import {Modal} from '..';
import styles from './styles.scss';
import {Range} from 'rc-slider';
import classNames from 'classnames';
import '!style-loader!css-loader!rc-slider/assets/index.css';

export default class Trimmer extends Component {

  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.state = {
      start: props.video.inpoint || 0,
      stop: props.video.outpoint || parseFloat(props.video.seconds)
    };
  }

  save = () => {
    this.props.onSave({
      ...this.props.video,
      inpoint: this.state.start,
      outpoint: this.state.stop,
      trimmed: true
    });
    this.props.onClose();
  }

  setTrim = ([start, stop]) => this.setState({start, stop})

  modalActions = [
    {
      label: 'Cancel',
      func: this.props.onClose
    },
    {
      label: 'Save',
      func: this.save
    }
  ]

  preview = () => {
    const {start} = this.state;
    this.videoRef.current.currentTime = start;
    this.videoRef.current.play();
  }

  render() {
    const {video, noModal, lowerThird} = this.props;
    const {start, stop} = this.state;
    const max = parseFloat(video.seconds);
    const content = (
      <React.Fragment>
        <div className={styles.videoContainer}>
          <video className={styles.video} ref={this.videoRef} src={`${video.src}#t=${start},${stop}`} controls/>
          {lowerThird && <img className={classNames(styles.lowerThird, styles[lowerThird.side])} src={lowerThird.path}/>}
        </div>
        <div className={styles.timestamps}>
          <div>{start}</div>
          <div>{stop}</div>
        </div>
        <Range
          value={[start, stop]}
          onChange={this.setTrim}
          onAfterChange={this.preview}
          min={0}
          max={max}
          step={0.01}
          allowCross={false}
        />
      </React.Fragment>
    );
    return noModal
      ? content
      : <Modal className={styles.modal} actions={this.modalActions}>{content}</Modal>;
  }
}
