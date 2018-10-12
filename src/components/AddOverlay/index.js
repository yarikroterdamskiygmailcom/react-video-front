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
      text: 'pepijnnnnn',
      emphasize: false,
      logo: false,
      vertical: 50,
      horizontal: 50,
      inpoint: props.video.inpoint,
      outpoint: props.video.outpoint
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props.video, nextProps.video) || !isEqual(this.state, nextState);
  }

  goToStep = step => () => this.setState({step})

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

  updateLowerThird = () => {
    php.post('overlay.php', {
      type: 'lowerthird',
      video_id: this.props.video.video_id,
      text: this.state.text,
      logo: true
    }).then(res => this.setState({lowerThird: `${res.src}?${Math.random()}`}));
  }

  save = () => {
    if(isNumber(this.state.editing)) {
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
        console.log(this.props.video.overlay);
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

  generateOverlay = () => {
    const {selectedType, vertical, emphasize, text} = this.state;
    const textLines = text.split(/\r?\n/);
    switch(selectedType) {
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
    const textarea = <textarea value={text} wrap="off" onChange={e => this.setState({text: e.target.value})}/>;
    const thumb = <img className={styles.thumb} src={video.thumb}/>;

    switch (step) {
      case 'overview':
        return <div className={styles.overview}>
          {!isEmpty(video.overlay) ? video.overlay.map(this.renderItem) : 'No overlay on this vid yet'}
        </div>;

      case 'chooseType':
        return <div className={styles.chooseType}>
          <div className={classNames(styles.type, selectedType === 'lowerThird' && styles.highlight)} onClick={this.setSelectedType('lowerThird')}>lowerThird</div>
          <div className={classNames(styles.type, selectedType === 'text' && styles.highlight)} onClick={this.setSelectedType('text')}>text</div>
          <div className={classNames(styles.type, selectedType === 'custom' && styles.highlight)} onClick={this.setSelectedType('custom')}>custom</div>
        </div>;

      case 'lowerThird':
        return <div className={styles.lowerThird}>
          <div className={styles.lowerThirdBox}>
            {thumb}
            <img className={styles.lowerThirdThumb} src={this.state.lowerThird}/>
          </div>
          <div onClick={this.updateLowerThird}>UPDATE</div>
          {textarea}
          <Toggle label="Emphasize first line" value={emphasize} onChange={this.toggleEmphasize}/>
          lower third side
          <Toggle label="Use Logo" value={logo} onChange={this.toggleLogo}/>

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
          {textarea}
          <Toggle label="Emphasize first line" value={emphasize} onChange={this.toggleEmphasize}/>
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
