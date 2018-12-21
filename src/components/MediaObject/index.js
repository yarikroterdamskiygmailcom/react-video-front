import React, {Component} from 'react';
import {Icon} from '../../atoms';
import FontAwesome from 'react-fontawesome';
import {SortableHandle} from 'react-sortable-hoc';
import classNames from 'classnames';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {Preview, SelectAsset, EditTitle, EditFade} from '../';

const formatTime = number => {
  const minutes = Math.floor(number / 60);
  const seconds = Math.floor(number % 60);
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

const isFade = mediatype => ['fadein', 'fadeout', 'fadeoutin', 'crossfade'].includes(mediatype);

const DragHandle = SortableHandle(() =>
  <div className={styles.handle}>
    <FontAwesome name="bars" />
  </div>
);

const getOverlay = mediatype => ({
  video: Preview,
  asset: SelectAsset,
  title: EditTitle,
  fadein: EditFade,
  fadeout: EditFade,
  fadeoutin: EditFade,
  crossfade: EditFade
}[mediatype]);

@inject('overlay')
@observer
export default class MediaObject extends Component {

  getOverlayProps = mediaObj => ({
    onSave: this.props.onChange,
    ...{src: mediaObj.mediatype === 'video' ? mediaObj.src : undefined},
    ...{title: mediaObj.mediatype === 'title' ? mediaObj : undefined},
    ...{fade: isFade(mediaObj.mediatype) ? mediaObj : undefined}
  })

  renderThumb = mediaObj => {
    const onClick = this.props.immutable
      ? {}
      : {onClick: this.props.overlay.openOverlay(getOverlay(mediaObj.mediatype))(this.getOverlayProps(mediaObj))};

    if (['video', 'asset'].includes(mediaObj.mediatype)) {
      return <img className={styles.thumb} src={mediaObj.thumb} {...onClick}/>;
    }

    if(isFade(mediaObj.mediatype)) {
      return <Icon className={styles.icon} name="fade" {...onClick}/>;
    }

    return <Icon className={styles.icon} name={mediaObj.mediatype} {...onClick}/>;
  }

  renderVideoDesc = video => (
    <div className={styles.videoDesc}>
      <div className={styles.oldDuration}>{video.duration}</div>
      <div className={styles.newDuration}>
        <Icon className={styles.icon} name="trim"/>
        <div>{formatTime(video.outpoint - video.inpoint)}</div>
      </div>
    </div>
  )

  renderMeta = mediaObj => {
    const {mediatype, videoname, title, text, inpoint, outpoint, duration, seconds} = mediaObj;
    const chosenTitle = {
      video: videoname,
      asset: title,
      title: text,
      fadein: 'Fade-In',
      fadeout: 'Fade-Out',
      fadeoutin: 'Fade-Out / Fade-In',
      crossfade: 'Crossfade'
    }[mediatype];

    const chosenDesc = {
      video: seconds > outpoint - inpoint ? this.renderVideoDesc(mediaObj) : duration,
      asset: '',
      title: duration,
      fadein: formatTime(duration),
      fadeout: formatTime(duration),
      fadeoutin: formatTime(duration),
      crossfade: formatTime(duration)
    }[mediatype];

    return (
      <div className={styles.meta}>
        <div className={styles.title}>{`(${mediatype}) ${chosenTitle}`}</div>
        <div className={styles.desc}>{chosenDesc}</div>
      </div>
    );
  }

  renderBody = () => (
    <React.Fragment>
      {this.renderThumb(this.props.value)}
      {this.renderMeta(this.props.value)}
    </React.Fragment>
  )

  render() {
    const {immutable, className} = this.props;
    return (
      <div className={classNames(styles.container, className)}>
        {this.renderBody()}
        {!immutable && <DragHandle />}
      </div>
    );
  }
}
