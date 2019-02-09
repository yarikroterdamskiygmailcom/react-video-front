import React, {Component} from 'react';
import {Modal} from '../';
import {php} from '../../stores';
import {pick} from 'lodash-es';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import styles from './styles.scss';

const modes = [
  {
    name: 'clip',
    description: 'Keep playing the selected song until this video ends.'
  },
  {
    name: 'vlog',
    description: 'Keep playing the selected song until the end of your vlog.'
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
    this.state = {
      musicList: [],
      listOpen: false,
      selected: this.props.video.audio
        ? pick(this.props.video.audio, ['title', 'artist', 'duration', 'src'])
        : null,
      playMode: this.props.video.audio ? this.props.video.audio.playMode : 'clip',
      mix: this.props.video.audio ? this.props.video.audio.mix : 'clip'
    };
  }

  componentWillMount() {
    php.get('/music')
    .then(res => this.setState({musicList: res}));
  }

  componentDidMount() {
    this.state.selected && this.audioRef.current.play();
  }

  onSave = () => {
    const changes = {
      clip: undefined,
      mixed: {...this.state.selected, playMode: this.state.playMode, mix: this.state.mix},
      music: {...this.state.selected, playMode: this.state.playMode, mix: this.state.mix},
    }[this.state.mix];
    this.props.onSave({audio: changes});
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
      disable: this.state.mix !== 'clip' && !this.state.selected
    }
  ]

  toggleList = () => this.setState(({listOpen: !this.state.listOpen}))

  setPlayMode = playMode => () => this.setState({playMode});

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

  renderSong = song => {
    const {id, title, artist, duration} = song;
    const selected = this.state.selected && (this.state.selected.id === id);
    return (
      <div className={classNames(styles.song, selected && styles.selected)} onClick={this.setSelected(song)}>
        <div className={styles.title}>{title}</div>
        <div className={styles.artist}>{artist}</div>
        <div className={styles.duration}>{duration}</div>
      </div>
    );
  }

  renderMode = ({name, description}) => (
    <div className={classNames(styles.playMode, name === this.state.playMode && styles.active)} onClick={this.setPlayMode(name)}>
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
    const {musicList, selected, mix, listOpen} = this.state;
    const musicListDisabled = mix === 'clip';
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
        <div className={classNames(styles.modeSelector, (listOpen || musicListDisabled) && styles.closed)}>
          {modes.map(this.renderMode)}
        </div>
        <div className={classNames(styles.mixSelector, listOpen && styles.closed)}>
          {mixes.map(this.renderMix)}
        </div>
        <div className={classNames(styles.label, listOpen && styles.hidden)}>{mixes.find(x => x.name === mix).description}</div>
      </Modal>
    );
  }
}
