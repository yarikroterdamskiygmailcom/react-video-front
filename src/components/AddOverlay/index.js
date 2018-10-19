import React, {Component} from 'react';
import styles from './styles.scss';
import {Modal, Trimmer} from '..';
import {isEmpty, isNumber, isEqual} from 'lodash-es';
import {Toggle, Icon} from '../../atoms';
import {StylePicker} from '../';
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
      style: null,
      vertical: 50,
      horizontal: 50,
      side: 'right',
      inpoint: props.video.inpoint,
      outpoint: props.video.outpoint
    };
  }

  updateLowerThird = () => {
    php.post('overlay.php', {
      type: 'lowerthird',
      video_id: this.props.video.video_id,
      text: this.state.text,
      logo: this.state.logo,
      placement: this.state.side,
      style: this.state.style
    }).then(res => this.setState({lowerThird: `${res.src}?${Math.random()}`}));
  }

  goToStep = step => () => {
    step === 'lowerThird' && this.updateLowerThird();
    this.setState({step});
  }

  setSelectedType = type => () => this.setState({selectedType: type})

  loadExisting = (overlay, i) => () => {
    this.setState({
      ...overlay,
      editing: i,
      step: overlay.type,
      selectedType: overlay.type
    });
  }

  buildOverlay = () => {
    const {selectedType, text, emphasize, side, logo, vertical, horizontal, inpoint, outpoint} = this.state;
    switch (selectedType) {
      case 'lowerThird':
        return {
          type: 'lowerThird',
          text,
          emphasize,
          placement: side,
          logo,
          inpoint,
          outpoint
        };

      case 'text':
        return {
          type: 'text',
          text,
          emphasize,
          vertical,
          inpoint,
          outpoint
        };

      case 'custom':
        return {
          type: 'custom'
        };

      default: throw new Error('rggg');
    }
  }
  save = () => {
    if (isNumber(this.state.editing)) {
      this.props.onSave(this.props.video.overlay.map((x, i) => i === this.state.editing ? this.buildOverlay() : x));
    } else {
      this.props.onSave([...this.props.video.overlay.toJS(), this.buildOverlay()]);
    }
    this.goToStep('overview')();
  }

  getModalActions = step => {
    switch (step) {
      case 'overview':
        return [
          {label: 'Close', func: this.props.onClose},
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

  deleteOverview = index => e => {
    e.stopPropagation();
    this.props.onSave(this.props.video.overlay.filter((x, i) => i !== index));
    this.forceUpdate();
  }

  renderItem = (item, i) => (
    <div key={item.text} className={styles.item} onClick={this.loadExisting(item, i)}>
      <div>{`${item.type} overlay`}</div>
      <Icon className={styles.icon} name="trash" onClick={this.deleteOverview(i)}/>
    </div>
  )

  renderRadio = value => (
    <div
      className={classNames(
        styles.radioButton,
        value === this.state.side && styles.active
      )}
      onClick={() =>
        this.setState({side: this.state.side === 'left' ? 'right' : 'left'})
        || this.updateLowerThird()}
    >
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
              <div key={line} className={classNames(styles.textLine,
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

  generateStyles = () => this.state.style ? {
    color: this.state.style.textcolor,
    background: this.state.style.backgroundcolor,
    fontFamily: this.state.style.font
  } : {}

  toggleEmphasize = () => this.setState({emphasize: !this.state.emphasize}, this.updateLowerThird)

  toggleLogo = () => this.setState({logo: !this.state.logo}, this.updateLowerThird)

  setVertical = val => this.setState({vertical: val})

  setStyle = style => this.setState({style})

  handleTrimmer = ([start, stop]) => this.setState({inpoint: start, outpoint: stop})

  generateContent = step => {
    const {video} = this.props;
    const {selectedType, text, emphasize, logo, vertical, horizontal, style} = this.state;
    const textarea = (props = {}) => <textarea className={styles.textarea} value={text} wrap="off" onChange={e => this.setState({text: e.target.value})} {...props} />;
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
            <img
              className={styles.lowerThirdThumb}
              style={this.state.side === 'left' ? {left: 0} : {right: 0}}
              src={this.state.lowerThird}
            />
          </div>
          {textarea({onBlur: this.updateLowerThird})}
          <StylePicker
            className={styles.stylePicker}
            onSelect={this.setStyle}
            selected={this.state.style}
          />
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
              <div className={styles.textBar} style={{...this.generateStyles(), bottom: `${vertical}%`}}>
                {text.split(/\r?\n/).map((line, i) => <div key={line} className={classNames(styles.textLine, (emphasize && i === 0) && styles.emphasizeFirst)}>{line}</div>)}
              </div>
              <Slider className={styles.textSlider} value={vertical} min={0} max={100} step={1} vertical onChange={this.setVertical} />
            </div>
          </div>
          {textarea()}
          <StylePicker
            className={styles.stylePicker}
            onSelect={this.setStyle}
            selected={this.state.style}
          />
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
