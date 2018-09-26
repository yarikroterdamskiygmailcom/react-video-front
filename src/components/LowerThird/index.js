import React, {Component} from 'react';
import {Input, Toggle, Seperator} from '../../atoms';
import {Modal, Trimmer} from '..';
import styles from './styles.scss';
import classNames from 'classnames';

export default class LowerThird extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step: 'overview',
      name: '',
      desc: '',
      useSecondLine: false,
      side: 'left',
      useLogo: false
    };
  }

  componentWillMount() {
    const {video} = this.props;
    this.setState({step: video.lowerthird ? 'overview' : 'config'});
  }

  setStep = step => () => this.setState({step})

  saveLowerThird = () => {
    if(this.props.video.lowerthird) {
      this.props.video.lowerthird.push();
    } else {
      this.props.video.lowerthird = [];
    }
    this.props.onClose();
  }

  actions = {
    overview: [
      {
        label: 'Cancel',
        func: this.props.onClose
      },
      {
        label: 'Create new...',
        func: this.setStep('config')
      }
    ],
    config: [
      {
        label: 'Cancel',
        func: this.props.onClose
      },
      {
        label: 'Next',
        func: this.setStep('preview')
      }
    ],
    preview: [
      {
        label: 'Back',
        func: this.setStep('overview')
      },
      {
        label: 'Save',
        func: this.saveLowerThird
      }
    ]
  }

  removeLowerThird = i => () => {
    this.props.video.lowerthird = this.props.video.lowerthird.filter((_, index) => index !== i);
  }

  setName = e => this.setState({name: e.target.value})
  setDesc = e => this.setState({desc: e.target.value})
  toggleSecondLine = () => this.setState({useSecondLine: !this.state.useSecondLine})
  toggleSide = () => this.setState({
    side: this.state.side === 'left' ? 'right' : 'left'
  })
  toggleUseLogo = () => this.setState({useLogo: !this.state.useLogo})

  renderRadio = value => (
    <div
      className={classNames(
        styles.button,
        value.toLowerCase() === this.state.side && styles.active
      )}
      onClick={this.toggleSide}>
      {value}
    </div>
  )

  renderItem = (value, i) => (
    <div className={styles.item}>
      <div>{value}</div>
      <div onClick={this.removeLowerThird(i)}><Icon name="trash" /></div>
    </div>
  )

  generateBody = step => {
    const {video} = this.props;
    const {name, desc, useSecondLine, useLogo} = this.state;
    switch (step) {
      case 'overview':
        return <React.Fragment>
          <div className={styles.list}>
            {video.lowerthird
              ? video.lowerthird.map(this.renderItem)
              : 'No Lower Third added to this video yet.'}
          </div>
        </React.Fragment>;

      case 'config':
        return <React.Fragment>
          <Input
            className={styles.input}
            fieldName="Name"
            nameTop
            value={name}
            onChange={this.setName}
          />
          <Input
            className={styles.input}
            fieldName="Function"
            nameTop
            value={desc}
            onChange={this.setDesc}
          />
          <Toggle
            label="Used second line"
            desc="Use it for function or company name"
            value={useSecondLine}
            onChange={this.toggleSecondLine}
          />
          <Seperator />
          <div>Lower Third Style</div>
          <div className={styles.switcherRow}>
            {this.renderRadio('left')}
            {this.renderRadio('right')}
          </div>
          <Toggle
            label="Use logo"
            desc="Use it for function or company name"
            value={useLogo}
            onChange={this.toggleUseLogo}
          />
        </React.Fragment>;

      case 'preview':
        return <React.Fragment>
          <Trimmer video={video} noModal />
        </React.Fragment>;

      default: throw new Error(`No switch case in lowerThird for ${step}`);

    }
  }

  render() {
    const {step} = this.state;
    const modalActions = this.actions[step];
    return (
      <Modal actions={modalActions}>
        {this.generateBody(step)}
      </Modal>
    );
  }
}
