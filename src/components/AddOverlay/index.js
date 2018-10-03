import React, {Component} from 'react';
import styles from './styles.scss';
import {Modal} from '..';
import {isEmpty} from 'lodash-es';
import {Toggle} from '../../atoms';
import Slider from 'rc-slider';
import classNames from 'classnames';
import '!style-loader!css-loader!rc-slider/assets/index.css';

export default class AddOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'overview',
      machine: this.generateState('overview', props.initialValue)
    };
  }

  generateState = (stateName, stateParam) => {
    const previousState = this.state ? {...this.state.machine} : {};
    return {
      text: '',
      vertical: 50,
      emphasizeFirst: false,
      ...previousState,
      modalActions: this.generateActions(stateName),
      ...stateParam
    };
  }

  goToState = (stateName, stateParam) => {
    this.setState({
      name: stateName,
      machine: this.generateState(stateName, stateParam)
    });
  }

  save = () => {
    const {horizontal, vertical, text, emphasizeFirst} = this.state.machine;
    this.props.video.overlay = [
      ...this.props.video.overlay,
      {
        text: text.split(/\r?\n/),
        emphasizeFirst,
        horizontal,
        vertical
      }
    ];
    this.goToState('overview');
  }

  generateActions = stateName => {
    switch (stateName) {
      case 'overview':
        return [
          {label: 'Cancel', func: this.props.onClose},
          {label: 'Add new...', func: () => this.goToState('chooseType')}
        ];

      case 'chooseType':
        return [
          {label: 'Back', func: () => this.goToState('overview')},
          {label: 'Select', func: () => this.goToState(this.state.machine.selectedType)}
        ];

      case 'lowerThird':
      case 'text':
      case 'custom':
        return [
          {label: 'Back', func: () => this.goToState('chooseType')},
          {label: 'Next', func: () => this.goToState('preview')}
        ];

      case 'preview':
        return [
          {label: 'Back', func: () => this.goToState(this.state.machine.selectedType)},
          {label: 'Save', func: this.save}
        ];

      default: throw new Error(`No modal actions found for ${stateName}`);
    }
  }

  renderItem = item => (
    <div />
  )

  generateContent = stateName => {
    const {video} = this.props;
    const {text, vertical, horizontal, selectedType, emphasizeFirst} = this.state.machine;
    const textarea = <textarea value={text} wrap="off" onChange={e => this.goToState(selectedType, {text: e.target.value})}/>;
    const thumb = <img className={styles.thumb} src={video.thumb}/>;

    switch (stateName) {
      case 'overview':
        return <React.Fragment>
          {!isEmpty(video.overlay) ? video.overlay.map(this.renderItem) : 'No overlay on this vid yet'}
        </React.Fragment>;

      case 'chooseType':
        return <React.Fragment>
          <div onClick={() => this.goToState('chooseType', {selectedType: 'lowerThird'})}>lowerThird</div>
          <div onClick={() => this.goToState('chooseType', {selectedType: 'text'})}>text</div>
          <div onClick={() => this.goToState('chooseType', {selectedType: 'custom'})}>custom</div>
        </React.Fragment>;

      case 'lowerThird':
        return <React.Fragment>

        </React.Fragment>;

      case 'text':
        return <React.Fragment>
          <div className={styles.textAligner}>
            <div className={styles.textBox}>
              {thumb}
              <div className={styles.textBar} style={{bottom: `${vertical}%`}}>
                {text.split(/\r?\n/).map((line, i) => <div className={classNames(styles.textLine, (emphasizeFirst && i === 0) && styles.emphasizeFirst)}>{line}</div>)}
              </div>
            </div>
            <Slider value={vertical} min={0} max={100} step={1} vertical onChange={val => this.goToState('text', {vertical: val})} />
          </div>
          {textarea}
          <Toggle label="Emphasize first line" value={emphasizeFirst} onChange={val => this.goToState(selectedType, {emphasizeFirst: val})}/>
        </React.Fragment>;

      case 'custom':
        return <React.Fragment>
          <div className={styles.aligner}>
            <div className={styles.alignerBox}>
              <img className={styles.alignerImg} src={video.thumb} />
              <div className={styles.alignerTarget} style={{bottom: `${vertical}%`, left: `${horizontal}%`}} />
            </div>
            <Slider value={vertical} min={0} max={100} step={1} vertical onChange={val => this.goToState('custom', {vertical: val})} />
          </div>
          <div className={styles.row}>
            <Slider value={horizontal} className={styles.sliderHor} min={0} max={100} step={1} onChange={val => this.goToState('custom', {horizontal: val})} />
            <div className={styles.spacer} />
          </div>
        </React.Fragment>;

      case 'preview':
        return <React.Fragment>

        </React.Fragment>;

      default: throw new Error(`No content found for ${stateName}`);
    }
  }

  render() {
    const {modalActions} = this.state.machine;
    return (
      <Modal actions={modalActions}>
        {this.generateContent(this.state.name)}
      </Modal>
    );
  }
}
