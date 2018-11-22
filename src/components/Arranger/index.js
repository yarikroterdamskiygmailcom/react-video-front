import React, {Component} from 'react';
import {Icon, SwipeItem} from '../../atoms';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {isEmpty} from 'lodash-es';
import placeholder from '../../../assets/vlogahead_applogo.png';

const formatTime = number => {
  const minutes = Math.floor(number / 60);
  const seconds = Math.floor(number % 60);
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

const getFadeName = mediatype => ({
  fadein: 'Fade-In',
  fadeout: 'Fade-Out',
  fadeoutin: 'Fade-Out / Fade-In',
  crossfade: 'Crossfade'
})[mediatype];

@inject('vlogEditor')
@observer
export default class Arranger extends Component {

  constructor(props) {
    super(props);
    this.state = {
      revealIndex: null,
      revealSide: null,
    };
  }

  renderActionLabel = (label, icon) => (
    <div className={styles.action}>
      <Icon name={icon} />
      <div>{label}</div>
    </div>
  )

  actions = {
    trim: i => ({
      label: this.renderActionLabel('Trim', 'trim'),
      func: this.props.vlogEditor.openTrimmer(i)
    }),
    lowerThird: i => ({
      label: this.renderActionLabel('Overlay', 'lowerThird'),
      func: this.props.vlogEditor.openLowerThird(i)
    }),
    delete: i => ({
      label: this.renderActionLabel('Delete', 'trash'),
      func: () => {
        this.props.vlogEditor.deleteMedia(i);
        this.resetReveal();
      }
    })
  }

  generateActions = (mediaObj, i) => {
    const actions = {
      video: [this.actions.trim(i), this.actions.lowerThird(i)],
      fadein: [],
      fadeout: [],
      fadeoutin: [],
      crossfade: [],
      title: [],
      asset: []
    }[mediaObj.mediatype];
    if (actions) { return actions; }
    throw new Error(`Tried to render media with mediatype ${mediaObj.mediatype}, must be one of ${Object.keys(actions)}`);
  }

  generateBody = ({thumb, videoname, duration, mediatype, trimmed, overlay, text, title, inpoint, outpoint}, index) => {
    const {openPreview} = this.props.vlogEditor;

    switch (mediatype) {
      case 'video':
        return (
          <React.Fragment>
            <img className={styles.thumb} src={thumb} onClick={openPreview(index)} onError={e => e.target.src = placeholder} />
            <div className={styles.fileMeta}>
              <div className={styles.fileName}>{videoname}</div>
              <div className={styles.fileProp}>
                <div className={classNames(styles.duration, trimmed && styles.strike)}>{duration}</div>
                {trimmed &&
                  <div className={styles.row}>
                    <div className={styles.duration}>{formatTime(outpoint - inpoint)}</div>
                    <Icon className={styles.icon} name="trim" style={{marginLeft: '10px'}} />
                  </div>}
                {!isEmpty(overlay) && <Icon className={styles.icon} name="lowerThird" />}
              </div>
            </div>
            <this.DragHandle />
          </React.Fragment>
        );

      case 'fadein':
      case 'fadeout':
      case 'fadeoutin':
      case 'crossfade':
        return (
          <React.Fragment>
            <Icon className={styles.bigIcon} name="fade" onClick={this.props.vlogEditor.openEditFade(index)} />
            <div className={styles.fileMeta}>
              <div className={styles.fileName}>{getFadeName(mediatype)}</div>
              <div className={styles.fileProp}>{`Duration: ${duration} seconds`}</div>
            </div>
            <this.DragHandle />
          </React.Fragment>
        );

      case 'title':
        return (
          <React.Fragment>
            <Icon className={styles.bigIcon} name="title" onClick={this.props.vlogEditor.openEditTitle(index)} />
            <div className={styles.fileMeta}>
              <div className={styles.fileName}>Title</div>
              <div className={styles.fileProp}>{text}</div>
            </div>
            <this.DragHandle />
          </React.Fragment>
        );

      case 'asset':
        return (
          <React.Fragment>
            <img className={styles.thumb} src={thumb} onClick={openPreview(index)} onError={e => e.target.src = placeholder} />
            <div className={classNames(styles.fileMeta, this.state.revealIndex === index && styles.active)}>
              <div className={styles.fileName}>Branding</div>
              <div className={styles.fileProp}>{title}</div>
            </div>
            <this.DragHandle />
          </React.Fragment>
        );

      default: throw new Error(`No body for ${mediatype}`);
    }

  }

  DragHandle = SortableHandle(() => <div className={styles.handle}><FontAwesome name="bars" /></div>);

  SortableItem = SortableElement(({value, revealIndex}) => (
    <SwipeItem
      actions={{left: this.generateActions(value, revealIndex), right: [this.actions.delete(revealIndex)]}}
      onSwipe={this.setReveal(revealIndex)}
      reveal={revealIndex === this.state.revealIndex && this.state.revealSide}
      className={styles.item}
    >
      {this.generateBody(value, revealIndex)}
    </SwipeItem>
  ));

  SortableList = SortableContainer(({items}) => (
    <div className={styles.list}>
      {items.map((value, index) => (
        <this.SortableItem
          key={`item-${index}`}
          index={index}
          revealIndex={index}
          value={value} />
      ))}
    </div>
  ));

  setReveal = index => side => () => {
    this.state.revealSide
      ? this.resetReveal()
      : this.setState({
        revealIndex: index,
        revealSide: side
      });
  }

  resetReveal = () => {
    this.setState({
      revealIndex: null,
      revealSide: null
    });
  }

  handleAction = (action, itemIndex) => () => {
    action.func(itemIndex);
    this.resetReveal();
  }

  render() {
    const {media, onSortEnd} = this.props.vlogEditor;
    return (
      <this.SortableList
        items={media}
        onSortEnd={onSortEnd}
        onSortStart={this.resetReveal}
        useDragHandle={true}
      />
    );
  }
}
