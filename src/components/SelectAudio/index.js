import React, {Component} from 'react';
import {Modal} from '../';
import {Toggle} from '../../atoms';
import {php} from '../../stores';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import styles from './styles.scss';

const modes = [
  {
    name: 'clip',
    description: 'Keep playing the selected song until this clip ends.'
  },
  {
    name: 'continuous',
    description: 'Keep playing the selected song until you specify otherwise.'
  },
];

const mixes = [
  {
    name: 'clip',
    description: 'Only play clip audio.'
  },
  {
    name: 'mixed',
    description: 'Mix clip audio with music.'
  },
  {
    name: 'music',
    description: 'Only play music.'
  }
];

export default class SelectAudio extends Component {
  constructor(props) {
    super(props);
    this.audioRef = React.createRef();
    console.log(props.video.audio);
    this.state = {
      musicList: [],
      listOpen: false,
      selected: props.video.audio
        ? props.video.audio.song || null
        : null,
      playmode: props.video.audio ? props.video.audio.playmode : 'clip',
      mix: props.video.audio ? props.video.audio.mix : 'clip',
      mute: props.video.audio ? props.video.audio.mute : false
    };
  }

  componentWillMount() {
    php.get('/music')
    .then(res => this.setState({musicList: res}));
  }

  componentDidMount() {
    this.state.selected && this.audioRef.current.play();
  }

  componentDidUpdate() {
    const {mute, mix} = this.state;
    (mute || (mix === 'clip')) && this.audioRef.current.pause();
  }

  onSave = () => {
    const {mix, playmode, selected, mute} = this.state;
    if (mute) {
      this.props.onSave({audio: {mute}});
    } else if (mix === 'clip') {
      this.props.onSave({audio: undefined});
    } else {
      this.props.onSave({
        audio: {
          song: selected, playmode, mix
        }
      });
    }
    this.props.onClose();
  }

  getModalActions = () => [
    {
      label: 'Cancel',
      func: this.props.onClose
    },
    {
      label: 'Save',
      func: this.onSave,
      disable: this.state.mute ? false : (this.state.mix !== 'clip' && !this.state.selected)
    }
  ]

  toggleList = () => this.setState(({listOpen: !this.state.listOpen}))

  toggleMute = () => this.setState({mute: !this.state.mute})

  setplaymode = playmode => () => this.setState({playmode});

  setMix = mixName => () => this.setState({mix: mixName})

  setSelected = song => () => this.setState({selected: song}, () => {
    this.audioRef.current.src = song.src;
    this.audioRef.current.play();
  })

  pause = e => {
    e && e.stopPropagation();
    this.audioRef.current.pause();
  }

  play = e => {
    e && e.stopPropagation();
    this.audioRef.current.play();
  }

  getMixDesc = () => {
    const maybeMix = mixes.find(x => x.name === this.state.mix);
    return maybeMix ? maybeMix.description : null;
  }

  renderSong = song => {
    const {id, title, artist, duration, style} = song;
    const selected = this.state.selected && (this.state.selected.id === id);
    return (
      <div className={classNames(styles.song, selected && styles.selected)} onClick={this.setSelected(song)}>
        <div className={styles.title}>{title}</div>
        <div className={styles.artist}>{artist}</div>
        <div className={styles.duration}>{`${duration} - ${style}`}</div>
      </div>
    );
  }

  renderMode = ({name, description}) => (
    <div className={classNames(styles.playmode, name === this.state.playmode && styles.active)} onClick={this.setplaymode(name)}>
      <div className={styles.name}>{name}</div>
      <div className={styles.description}>{description}</div>
    </div>
  )

  renderMix = ({name}) => (
    <div className={classNames(styles.mix, name === this.state.mix && styles.selected)} onClick={this.setMix(name)}>
      {name}
    </div>
  )

  render() {
    const {musicList, selected, mix, listOpen, mute} = this.state;
    const musicListDisabled = (mix === 'clip' || mute);
    return (
      <Modal actions={this.getModalActions()} contentClassName={styles.container}>
        <audio src={selected && selected.src} ref={this.audioRef} />
        <div className={classNames(styles.listToggle, musicListDisabled && styles.disabled)} onClick={this.toggleList}>
          <FontAwesome className={classNames(styles.icon, styles.expand)} name={listOpen ? 'minus' : 'plus'} />
          <div className={classNames(styles.label, selected && styles.active)}>{selected ? selected.title : 'Select Music...'}</div>
          <FontAwesome className={styles.icon} name="pause" onClick={this.pause} />
          <FontAwesome className={styles.icon} name="play" onClick={this.play} />
        </div>
        <div className={classNames(styles.musicList, !listOpen && styles.closed)}>
          {musicList.map(this.renderSong)}
        </div>
        <div className={classNames(styles.modeSelector, listOpen && styles.closed, musicListDisabled && styles.disabled)}>
          {modes.map(this.renderMode)}
        </div>
        <div className={classNames(styles.mixSelector, listOpen && styles.closed, mute && styles.disabled)}>
          {mixes.map(this.renderMix)}
        </div>
        <div className={classNames(styles.label, (listOpen || mute) && styles.hidden)}>{this.getMixDesc()}</div>
        <Toggle className={classNames(styles.toggle, listOpen && styles.hidden)} label="Mute all" value={mute} onChange={this.toggleMute} />
      </Modal>
    );
  }
}
