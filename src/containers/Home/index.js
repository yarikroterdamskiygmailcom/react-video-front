import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {Carousel, Icon, Input} from '../../atoms';
import {isEmpty} from 'lodash-es';
import {observer, inject} from 'mobx-react';
import styles from './styles.scss';
import placeholder from '../../../assets/placeholder.png';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';

@withRouter
@inject('vlogs')
@inject('project')
@inject('vlogEditor')
@inject('session')
@observer
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.searchRef = React.createRef();
    this.state = {
      pending: true,
      searchActive: false,
      searchValue: ''
    };
  }

  componentDidMount() {
    this.props.vlogs.loadVlogs().then(() => this.setState({pending: false}));
  }

  viewDetails = vlog => {
    this.props.project.setProject(vlog);
    this.props.history.push('/vlog-details');
  }

  enableSearch = () => {
    this.searchRef.current.focus();
    this.setState({searchActive: true, searchValue: ''});
  }

  disableSearch = () => {
    this.setState({searchActive: false, searchValue: ''});
  }

  setSearch = e => this.setState({searchValue: e.target.value})

  renderHighlight = () => {
    const video = this.props.vlogEditor.media.filter(media => media.mediatype === 'video')[0];
    return (
      <div className={styles.center}>
        <div className={styles.highlight} onClick={() => this.props.history.push('/edit-vlog')}>
          <img
            className={styles.thumb}
            src={video.thumb}
            onError={e => e.target.src = placeholder}
          />
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
      onError={e => e.target.src = placeholder}
    />
    <div className={styles.title}>{item.title || 'Untitled'}</div>
    <div className={styles.duration}>{item.duration}</div>
  </div>

  renderHint = () => (
    <div className={styles.hint}>
      <div>Start creating your first vlog here!</div>
      <Icon className={styles.arrow} name="arrow"/>
    </div>
  )

  render() {
    const {searchActive, searchValue} = this.state;
    const vlogs = this.state.searchValue
      ? this.props.vlogs.list.filter(vlog => vlog.title.toLowerCase().includes(this.state.searchValue.toLowerCase()))
      : this.props.vlogs.list;
    return (
      <div className={styles.container}>
        {/* Geen highlight voor nu */}
        {/* {!isEmpty(this.props.vlogEditor.media) && this.renderHighlight()} */}
        {this.state.pending && <FontAwesome className={styles.spinner} name="spinner"/>}
        <div className={styles.carousels}>
          <Carousel
            title="Saved Vlogs"
            items={vlogs.filter(vlog => ['new', 'saved'].includes(vlog.status))}
            renderFunction={this.renderItem}
            scrollStep={310}
            onClick={this.viewDetails}
            className={styles.carousel}
          />
          <Carousel
            title="Rendered Vlogs"
            items={vlogs.filter(vlog => vlog.status === 'exported')}
            renderFunction={this.renderItem}
            scrollStep={310}
            onClick={this.viewDetails}
            className={styles.carousel}
          />
          <Carousel
            title="Shared Vlogs"
            items={vlogs.filter(vlog => vlog.access === 'team')}
            renderFunction={this.renderItem}
            scrollStep={310}
            onClick={this.viewDetails}
            className={styles.carousel}
          />
        </div>
        {isEmpty(this.props.vlogs.list) && !this.state.pending && this.renderHint()}
        <FontAwesome className={styles.searchButton} name="search" onClick={this.enableSearch}/>
        <Input
          className={classNames(styles.search, searchActive && styles.active)}
          inputRef={this.searchRef}
          field
          value={searchValue}
          onChange={this.setSearch}
          onBlur={this.disableSearch}
        />
      </div>
    );
  }
}
