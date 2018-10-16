import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {Carousel, Icon} from '../../atoms';
import {isEmpty} from 'lodash-es';
import {observer, inject} from 'mobx-react';
import styles from './styles.scss';

@withRouter
@inject('vlogs')
@inject('vlogEditor')
@inject('vlogDetails')
@inject('session')
@observer
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: false
    };
  }

  componentWillMount() {
    this.setState({pending: true});
    this.props.vlogs.loadVlogs().then(() => {
      if (this.props.session.error) {
        this.props.session.logout();
      } else {
        this.setState({pending: false});
      }
    });
  }

  viewDetails = vlog => {
    this.props.vlogDetails.setVlog(vlog);
    this.props.history.push('/vlog-details');
  }

  renderHighlight = () => {
    const video = this.props.vlogEditor.media.filter(media => media.mediatype === 'video')[0];
    return (
      <div className={styles.center}>
        <div className={styles.highlight} onClick={() => this.props.history.push('/edit-vlog')}>
          <img
            className={styles.thumb}
            src={video.thumb}
          />
          <div className={styles.gradient}/>
          <div className={styles.title}>{video.title || 'Untitled'}</div>
          <div className={styles.duration}>{video.duration}</div>
        </div>
      </div>
    );
  }

renderItem = (item, i) =>
  <div key={`${item.thumb}-${i}`} className={styles.item} onClick={() => this.viewDetails(item)}>
    <img
      className={styles.thumb}
      src={item.thumb}
    />
    <div className={styles.gradient}/>
    <div className={styles.title}>{item.title || 'Untitled'}</div>
    <div className={styles.duration}>{item.duration}</div>
  </div>

render() {

  return (
    <div className={styles.container}>
      {!isEmpty(this.props.vlogEditor.media) && this.renderHighlight()}
      <div className={styles.carousels}>
        <Carousel
          title="Saved Vlogs"
          items={this.props.vlogs.list.filter(vlog => ['new', 'saved'].includes(vlog.status))}
          renderFunction={this.renderItem}
          scrollStep={310}
          onClick={this.viewDetails}
          pending={this.state.pending}
        />
        <Carousel
          title="Rendered Vlogs"
          items={this.props.vlogs.list.filter(vlog => vlog.status === 'exported')}
          renderFunction={this.renderItem}
          scrollStep={310}
          onClick={this.viewDetails}
          pending={this.state.pending}
        />
        <Carousel
          title="Shared Vlogs"
          items={this.props.vlogs.list.filter(vlog => vlog.status === 'shared')}
          renderFunction={this.renderItem}
          scrollStep={310}
          onClick={this.viewDetails}
          pending={this.state.pending}
        />
      </div>
    </div>
  );
}
}
