import React, {Component} from 'react';
import {Modal} from '../';
import {php} from '../../stores';
import {pick} from 'lodash-es';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import styles from './styles.scss';

const modes = [
  {
    name: 'original',
    description: `Keep the original audio belonging to this video.`
  },
  {
    name: 'clip',
    description: 'Keep playing the selected song until this video ends.'
  },
  {
    name: 'vlog',
    description: 'Keep playing the selected song until the end of your vlog.'
  },
  {
    name: 'remove',
    description: 'Remove all audio from this video.',
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
      playMode: this.props.video.audio ? this.props.video.audio.playMode : 'clip'
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
      original: undefined,
      clip: {...this.state.selected, playMode: this.state.playMode},
      vlog: {...this.state.selected, playMode: this.state.playMode},
      remove: {playMode: this.state.playMode}
    }[this.state.playMode];
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
      disable: ['clip', 'vlog'].includes(this.state.playMode) && !this.state.selected
    }
  ]

  toggleList = () => this.setState(({listOpen: !this.state.listOpen}))

  setPlayMode = playMode => () => {
    this.state.selected && ['original', 'remove'].includes(playMode) && this.pause();
    this.setState({playMode});
  }

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
    const {title, artist, duration, src} = song;
    return (
      <div className={styles.song} onClick={this.setSelected(song)}>
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

  render() {
    const {musicList, selected, playMode, listOpen} = this.state;
    const musicListDisabled = ['original', 'remove'].includes(playMode);
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
        <div className={classNames(styles.modeSelector, listOpen && styles.closed)}>
          <div className={styles.label}>Play mode</div>
          {modes.map(this.renderMode)}
        </div>
      </Modal>
    );
  }
}
