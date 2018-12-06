import React, {Component} from 'react';
import {Modal} from '..';
import styles from './styles.scss';
import {Slider} from '../../atoms';
import '!style-loader!css-loader!rc-slider/assets/index.css';
import FontAwesome from 'react-fontawesome';

export default class Splitter extends Component {

  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.state = {
      split: props.video.inpoint + ((props.video.outpoint - props.video.inpoint) / 2),
      offset: 0
    };
  }

  split = () => {
    this.props.onSave(this.state.split);
    this.props.onClose();
  }

  setOffset = offset => this.setState({offset}, () => this.videoRef.current.currentTime = this.state.split + offset);

  commitSplit = () => this.setState({split: this.state.split + this.state.offset, offset: 0});

  modalActions = [
    {
      label: 'Cancel',
      func: this.props.onClose
    },
    {
      label: 'Split',
      func: this.split
    }
  ]

  render() {
    const {video} = this.props;
    const {inpoint, outpoint} = video;
    const {split, offset} = this.state;
    return (
      <Modal className={styles.modal} actions={this.modalActions}>
        <video className={styles.video} ref={this.videoRef} src={video.src} playsInline/>
        <Slider value={split} offset={offset} min={inpoint} max={outpoint} onSwiping={this.setOffset} onSwiped={this.commitSplit}/>
      </Modal>
    );
  }
}
