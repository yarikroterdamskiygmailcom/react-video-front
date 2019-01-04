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

  componentDidMount() {
    this.props.onChange(this.state.split);
  }

  setOffset = offset => this.setState({offset}, this.shiftVideo);

  commitSplit = () => this.setState({split: this.state.split + this.state.offset, offset: 0}, () => this.props.onChange(this.state.split));

  onChange = value =>
    this.setState({split: value}, () => {
      this.shiftVideo();
      this.props.onChange(this.state.split);
    });

  shiftVideo = () => this.videoRef.current.currentTime = this.state.split + this.state.offset

  render() {
    const {video} = this.props;
    const {inpoint, outpoint} = video;
    const {split, offset} = this.state;
    return (
      <React.Fragment>
        <video className={styles.video} ref={this.videoRef} src={video.src} playsInline />
        <Slider
          value={split}
          offset={offset}
          min={inpoint}
          max={outpoint}
          onSwiping={this.setOffset}
          onSwiped={this.commitSplit}
          onChange={this.onChange}
        />
      </React.Fragment>
    );
  }
}
