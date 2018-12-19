import React, {Component} from 'react';
import {Icon} from '../../atoms';
import FontAwesome from 'react-fontawesome';
import {SortableHandle} from 'react-sortable-hoc';
import classNames from 'classnames';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {Preview, SelectAsset, EditTitle} from '../';

const DragHandle = SortableHandle(() =>
  <div className={styles.handle}>
    <FontAwesome name="bars" />
  </div>
);

const getOverlay = mediatype => ({
  video: Preview,
  asset: SelectAsset,
  title: EditTitle
}[mediatype]);

@inject('overlay')
@observer
export default class MediaObject extends Component {

  getOverlayProps = mediaObj => ({
    onSave: this.props.onChange,
    ...{src: mediaObj.mediatype === 'video' ? mediaObj.src : undefined},
    ...{title: mediaObj.mediatype === 'title' ? mediaObj : undefined}
  })

  renderThumb = mediaObj => {
    const onClick = this.props.immutable
      ? {}
      : {onClick: this.props.overlay.openOverlay(getOverlay(mediaObj.mediatype))(this.getOverlayProps(mediaObj))};

    if (mediaObj.mediatype === 'video') {
      return <img className={styles.thumb} src={mediaObj.thumb} {...onClick}/>;
    }

    return <Icon className={styles.icon} name={mediaObj.mediatype} {...onClick}/>;
  }
  renderMeta = mediaObj => {
    const {mediatype, videoname, title, text, duration} = mediaObj;
    const chosenTitle = {
      video: videoname,
      asset: title,
      title: text
    }[mediatype];

    const chosenDesc = {
      video: duration,
      asset: '',
      title: duration
    }[mediatype];

    return (
      <div className={styles.meta}>
        <div className={styles.title}>{`(${mediatype}) ${chosenTitle}`}</div>
        <div className={styles.desc}>{`${chosenDesc}`}</div>
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
