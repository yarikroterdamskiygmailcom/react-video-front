import React, {Component} from 'react';
import {Input, Toggle, Button, Seperator, RadioButton} from '../../atoms';
import {Modal, Trimmer} from '..';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {Range} from 'rc-slider';
import classNames from 'classnames';

@inject('vlogEditor')
@observer
export default class LowerThird extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step: 0
    };
  }

  nextStep = () => {
    this.setState({step: this.state.step + 1});
  }

  actions = [
    {
      label: 'Cancel',
      func: this.props.vlogEditor.closeOverlay
    },
    {
      label: 'Next',
      func: this.nextStep
    }
  ]

  renderButton = value => {
    const {lowerThirdSide, toggleLowerThirdSide} = this.props.vlogEditor;
    return (
      <div className={classNames(styles.button, value.toLowerCase() === lowerThirdSide && styles.active)} onClick={toggleLowerThirdSide}>
        {value}
      </div>
    );
  }

  renderFirst = () => {
    const {lowerThirdSecondLine, toggleLowerThirdSecondLine} = this.props.vlogEditor;
    return <React.Fragment>
      <Input className={styles.input} fieldName="Name" nameTop />
      <Input className={styles.input} fieldName="Function" nameTop />
      <Toggle label="Used second line" desc="Use it for function or company name" value={lowerThirdSecondLine} onChange={toggleLowerThirdSecondLine} />
      <Seperator />
      <div>Lower Third Style</div>
      <div className={styles.switcherRow}>
        {this.renderButton('Left')}
        {this.renderButton('Right')}
      </div>
      <Toggle label="Use logo" desc="Use it for function or company name" />
    </React.Fragment>;
  }

  initEndTime = () => this.props.vlogEditor.setLowerThirdTime([this.props.vlogEditor.currentVideo.inpoint, this.props.vlogEditor.currentVideo.outpoint])

  renderSecond = () => {
    const {lowerThirdStart, lowerThirdEnd, setLowerThirdTime, currentVideo} = this.props.vlogEditor;
    return <React.Fragment>
      <video
        className={styles.video}
        ref={this.videoRef}
        src={this.props.vlogEditor.currentVideo.src}
        autoPlay
        onLoadedMetadata={this.initEndTime}
      />
      <div className={styles.timestamps}>
        <div>{lowerThirdStart}</div>
        <div>{lowerThirdEnd}</div>
      </div>
      <Range
        value={[lowerThirdStart, lowerThirdEnd]}
        onChange={setLowerThirdTime}
        min={parseInt(currentVideo.inpoint, 10)}
        max={parseInt(currentVideo.outpoint, 10)}
        step={0.001}
        allowCross={false}
      />
    </React.Fragment>;
  }

  steps = [this.renderFirst(), this.renderSecond()]

  render() {
    return (
      <Modal actions={this.actions}>
        {this.steps[this.state.step]}
      </Modal>
    );
  }
}
