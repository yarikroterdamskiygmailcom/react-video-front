import React, {Component} from 'react';
import {Input, Toggle, Seperator} from '../../atoms';
import {Modal, Trimmer} from '..';
import {php} from '../../stores';
import styles from './styles.scss';
import classNames from 'classnames';
import {observer, inject} from 'mobx-react';

@inject('session')
@observer
class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: null,
      file: null
    };
  }

  getPreview = () => {
    const {video, name, desc, side, useLogo, active} = this.props;
    php.post(`lowerthird.php`, {
      firstline: name,
      secondline: desc,
      placement: side,
      useimage: useLogo,
      previewframe: false,
      lt_id: active,
      video_id: video.videoid
    }).then(res => {
      const {extpath, imagename} = res;
      this.setState({path: extpath, file: imagename});
    });
  }

  componentWillMount() {
    this.getPreview();
  }

  componentWillUnmount() {
    this.setState({path: null, file: null});
  }

  render() {
    const {video, side} = this.props;
    const path = `${this.state.path}${this.state.file}?${Math.random()}`;
    return (
      <React.Fragment>
        {path && <Trimmer video={video} noModal />}
      </React.Fragment>
    );
  }

}

@inject('session')
@observer
export default class LowerThird extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step: 'overview',
      active: 0,
      name: '',
      desc: '',
      useSecondLine: false,
      side: 'left',
      useLogo: false,
      path: null,
      file: null,
    };
  }

  componentWillMount() {
    const {video} = this.props;
    this.setState({step: video.lowerthird ? 'overview' : 'config'});
  }

  setStep = step => () => this.setState({step})

  setActive = i => this.setState({active: i})

  saveLowerThird = () => {
    const {video} = this.props;
    const {name, desc, useLogo, side, file} = this.state;
    const lt = {
      firstline: name,
      secondline: desc,
      logo: useLogo,
      placement: side,
      file,
    };
    const insert = video.lowerthird ? [...video.lowerthird, lt] : [lt];

    php.post('editvid.php', {
      debug: true,
      action: 'lowerthird',
      video_id: video.videoid,
      edit: insert
    }).then(res => {
      this.props.onClose();
    });
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
        func: this.setStep('config') || this.setState({path: null, file: null})
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
      <div onClick={this.setActive(i)}>{value}</div>
      <div onClick={this.removeLowerThird(i)}><Icon name="trash" /></div>
    </div>
  )

  generateBody = step => {
    const {video} = this.props;
    const {name, desc, useSecondLine, useLogo, side, active} = this.state;
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
        return <Preview video={video} name={name} desc={desc} side={side} useLogo={useLogo} active={active}/>;

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
