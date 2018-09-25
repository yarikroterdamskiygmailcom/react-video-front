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

  actions = [
    {
      label: 'Cancel',
      func: this.props.vlogEditor.closeOverlay
    },
    {
      label: 'Next',
      func: () => this.props.vlogEditor.lowerThirdStep++
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
    const {
      lowerThirdName, lowerThirdDesc, lowerThirdSecondLine, lowerThirdLogo,
      setLowerThirdName, setLowerThirdDesc, toggleLowerThirdSecondLine, toggleLowerThirdLogo
    } = this.props.vlogEditor;
    return <React.Fragment>
      <Input className={styles.input} fieldName="Name" nameTop value={lowerThirdName} onChange={setLowerThirdName}/>
      <Input className={styles.input} fieldName="Function" nameTop value={lowerThirdDesc} onChange={setLowerThirdDesc}/>
      <Toggle label="Used second line" desc="Use it for function or company name" value={lowerThirdSecondLine} onChange={toggleLowerThirdSecondLine} />
      <Seperator />
      <div>Lower Third Style</div>
      <div className={styles.switcherRow}>
        {this.renderButton('left')}
        {this.renderButton('right')}
      </div>
      <Toggle label="Use logo" desc="Use it for function or company name" value={lowerThirdLogo} onChange={toggleLowerThirdLogo}/>
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

  render() {
    const {lowerThirdStep} = this.props.vlogEditor;
    return (
      <Modal actions={this.actions}>
        {lowerThirdStep === 1 && this.renderFirst()}
        {lowerThirdStep === 2 && this.renderSecond()}
      </Modal>
    );
  }
}
