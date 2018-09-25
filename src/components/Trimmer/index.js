import React, {Component} from 'react';
import {Button, Slider} from '../../atoms';
import {Modal} from '..';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {Range} from 'rc-slider';
import '!style-loader!css-loader!rc-slider/assets/index.css';

@inject('vlogEditor')
@observer
export default class Trimmer extends Component {

  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentWillMount() {
    const {currentVideo, setTrim} = this.props.vlogEditor;
    console.log(currentVideo);
    if(currentVideo.trimmed) {
      setTrim([currentVideo.inpoint, currentVideo.outpoint]);
    }
  }

  actions = [
    {
      label: 'Cancel',
      func: this.props.vlogEditor.closeOverlay
    },
    {
      label: 'Trim',
      func: this.props.vlogEditor.trimVideo
    }
  ]

  preview = () => {
    const {startTime, endTime} = this.props.vlogEditor.trimmer;
    setTimeout(() => this.videoRef.current.pause(), (endTime - startTime) * 1000);
    this.videoRef.current.currentTime = startTime;
    this.videoRef.current.play();
  }

  initEndTime = () => !this.props.vlogEditor.currentVideo.trimmed && this.props.vlogEditor.initEndTime(this.videoRef.current.duration);

  render() {
    const {setTrim, currentVideo} = this.props.vlogEditor;
    const {startTime, endTime} = this.props.vlogEditor.trimmer;
    console.log(startTime, endTime);
    return (
      <Modal className={styles.modal} actions={this.actions}>
        <video className={styles.video} ref={this.videoRef} src={currentVideo.src} autoPlay onLoadedMetadata={this.initEndTime}/>
        <Button onClick={this.preview} text="Preview"/>
        <div className={styles.timestamps}>
          <div>{startTime}</div>
          <div>{endTime}</div>
        </div>
        <Range
          value={[startTime, endTime]}
          onChange={setTrim}
          min={0}
          max={currentVideo.vidtime}
          step={0.01}
          allowCross={false}
        />
      </Modal>
    );
  }
}
