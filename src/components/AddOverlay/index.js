import React, {Component} from 'react';
import styles from './styles.scss';
import {Modal, Trimmer} from '..';
import {isEmpty, isNumber, isEqual} from 'lodash-es';
import {Toggle} from '../../atoms';
import Slider from 'rc-slider';
import classNames from 'classnames';
import '!style-loader!css-loader!rc-slider/assets/index.css';
import {php} from '../../stores';

export default class AddOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'overview',
      selectedType: null,
      editing: false,
      text: '',
      emphasize: false,
      logo: false,
      vertical: 50,
      horizontal: 50,
      side: 'right',
      inpoint: props.video.inpoint,
      outpoint: props.video.outpoint
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props.video, nextProps.video) || !isEqual(this.state, nextState);
  }

  updateLowerThird = () => {
    php.post('overlay.php', {
      type: 'lowerthird',
      video_id: this.props.video.video_id,
      text: this.state.text,
      logo: true
    }).then(res => this.setState({lowerThird: `${res.src}?${Math.random()}`}));
  }

  goToStep = step => () => {
    step === 'lowerThird' && this.updateLowerThird();
    this.setState({step});
  }

  setSelectedType = type => () => this.setState({selectedType: type})

  loadExisting = (overlay, i) => () => {
    this.setState({editing: i, step: overlay.type});
  }

  buildOverlay = () => ({
    type: this.state.selectedType,
    text: this.state.text,
    emphasize: this.state.emphasize,
    vertical: this.state.vertical,
    horizontal: this.state.horizontal,
    inpoint: this.state.inpoint,
    outpoint: this.state.outpoint
  })

  save = () => {
    if (isNumber(this.state.editing)) {
      this.props.onSave({
        overlay: this.props.video.overlay.map((x, i) => i === this.state.editing ? this.buildOverlay() : x)
      });
    } else {
      this.props.onSave({
        overlay: this.props.video.overlay.push(this.buildOverlay())
      });
    }
    this.setState({step: 'overview', editing: false});
  }

  getModalActions = step => {
    switch (step) {
      case 'overview':
        return [
          {label: 'Cancel', func: this.props.onClose},
          {label: 'Add new...', func: this.goToStep('chooseType')}
        ];

      case 'chooseType':
        return [
          {label: 'Back', func: this.goToStep('overview')},
          {label: 'Select', func: this.goToStep(this.state.selectedType)}
        ];

      case 'lowerThird':
      case 'text':
        return [
          {label: 'Back', func: this.goToStep('chooseType')},
          {label: 'Next', func: this.goToStep('preview')}
        ];

      case 'custom':
        return [
          {label: 'Back', func: this.goToStep('chooseType')},
          {label: '///', func: null}
        ];

      case 'preview':
        return [
          {label: 'Back', func: this.goToStep(this.state.selectedType)},
          {label: 'Save', func: this.save}
        ];

      default: throw new Error(`No modal actions found for step ${step}`);
    }
  }

  renderItem = (item, i) => (
    <div className={classNames(styles.item, i === this.state.editing && styles.active)} onClick={this.loadExisting(item, i)}>
      <div>{`Type: ${item.type}`}</div>
    </div>
  )

  renderRadio = value => (
    <div
      className={classNames(
        styles.radioButton,
        value === this.state.side && styles.active
      )}
      onClick={() => this.setState({side: this.state.side === 'left' ? 'right' : 'left'})}>
      {value}
    </div>
  )

  generateOverlay = () => {
    const {selectedType, vertical, emphasize, text} = this.state;
    const textLines = text.split(/\r?\n/);
    switch (selectedType) {
      case 'lowerThird':
        break;
      case 'text':
        return (
          <div className={styles.textPreview} style={{bottom: `${vertical}%`}}>
            {textLines.map((line, i) =>
              <div className={classNames(styles.textLine,
                (emphasize && i === 0) && styles.bold)}>
                {line}
              </div>)}
          </div>
        );
      case 'custom':
        break;

      default: throw new Error('Blaarb');

    }
  }

  toggleEmphasize = () => this.setState({emphasize: !this.state.emphasize})

  toggleLogo = () => this.setState({logo: !this.state.logo})

  setVertical = val => this.setState({vertical: val})

  handleTrimmer = ([start, stop]) => this.setState({inpoint: start, outpoint: stop})

  generateContent = step => {
    const {video} = this.props;
    const {selectedType, text, emphasize, logo, vertical, horizontal} = this.state;
    const textarea = (props = {}) => <textarea className={styles.textarea} value={text} wrap="off" onChange={e => this.setState({text: e.target.value})} {...props}/>;
    const thumb = <img className={styles.thumb} src={video.thumb} />;

    switch (step) {
      case 'overview':
        return <div className={styles.overview}>
          {!isEmpty(video.overlay) ? video.overlay.map(this.renderItem) : 'No overlay on this vid yet'}
        </div>;

      case 'chooseType':
        return <div className={styles.chooseType}>
          <div>What kind of overlay would you like to add?</div>
          <div>
            <div
              className={classNames(styles.type, selectedType === 'lowerThird' && styles.active)}
              onClick={this.setSelectedType('lowerThird')}
            >
              <div className={styles.typeName}>Lower Third</div>
              <div className={styles.typeDesc}>Introduce people in your vlog with a Lower Third.</div>
            </div>
            <div
              className={classNames(styles.type, selectedType === 'text' && styles.active)}
              onClick={this.setSelectedType('text')}
            >
              <div className={styles.typeName}>Text</div>
              <div className={styles.typeDesc}>Place some text over your video.</div>
            </div>
            <div
              className={classNames(styles.type, selectedType === 'custom' && styles.active)}
              onClick={this.setSelectedType('custom')}
            >
              <div className={styles.typeName}>Custom</div>
              <div className={styles.typeDesc}>Configure an overlay exactly to your liking!</div>
            </div>
          </div>
        </div>;

      case 'lowerThird':
        return <div className={styles.lowerThird}>
          <div className={styles.lowerThirdBox}>
            {thumb}
            <img className={styles.lowerThirdThumb} src={this.state.lowerThird} />
          </div>
          {textarea({onBlur: this.updateLowerThird})}
          <Toggle className={styles.toggle} label="Emphasize first line" value={emphasize} onChange={this.toggleEmphasize} />
          <Toggle className={styles.toggle} label="Use Logo" value={logo} onChange={this.toggleLogo} />
          <div>Lower Third side</div>
          <div className={styles.radioRow}>
            {this.renderRadio('left')}
            {this.renderRadio('right')}
          </div>
        </div>;

      case 'text':
        return <div className={styles.text}>
          <div className={styles.textAligner}>
            <div className={styles.textBox}>
              {thumb}
              <div className={styles.textBar} style={{bottom: `${vertical}%`}}>
                {text.split(/\r?\n/).map((line, i) => <div className={classNames(styles.textLine, (emphasize && i === 0) && styles.emphasizeFirst)}>{line}</div>)}
              </div>
              <Slider className={styles.textSlider} value={vertical} min={0} max={100} step={1} vertical onChange={this.setVertical} />
            </div>
          </div>
          {textarea()}
          <Toggle className={styles.toggle} label="Emphasize first line" value={emphasize} onChange={this.toggleEmphasize} />
        </div>;

      case 'custom':
        return <div className={styles.custom}>
          <div>Coming soon!</div>
        </div>;

      case 'preview':
        return <div className={styles.preview}>
          <Trimmer noModal video={this.props.video} onChange={this.handleTrimmer}>
            {this.generateOverlay()}
          </Trimmer>
        </div>;

      default: throw new Error(`No content found for ${step}`);
    }
  }

  render() {
    const {step} = this.state;
    return (
      <Modal actions={this.getModalActions(step)}>
        {this.generateContent(step)}
      </Modal>
    );
  }
}
