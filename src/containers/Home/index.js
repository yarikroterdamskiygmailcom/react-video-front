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
@observer
export default class Home extends Component {

  componentWillMount() {
    this.props.vlogs.loadVlogs();
  }

  viewDetails = vlog => {
    this.props.vlogDetails.setVlog(vlog);
    this.props.history.push('/vlog-details');
  }

  renderHighlight = () =>
    <div className={styles.highlight} style={{background: 'linear-gradient(0deg, rgba(0, 0, 0, 5e-05) 17.77%, rgba(0, 0, 0, 0.35) 74.79%)'}}>

    </div>

renderItem = item =>
  <div key={item.thumb} className={styles.item} onClick={() => this.viewDetails(item)}>
    <img
      className={styles.thumb}
      src={item.thumb}
      style={{background: `linear-gradient(0deg, rgba(0, 0, 0, 5e-05) 17.77%, rgba(0, 0, 0, 0.35) 74.79%)`}}
    />
    <div className={styles.title}>{item.title || 'Untitled'}</div>
    <div className={styles.duration}>{item.duration}</div>
  </div>

render() {
  return (
    <div className={styles.container}>
      {!isEmpty(this.props.vlogEditor.media) && this.renderHighlight()}
      <div className={styles.carousels}>
        <Carousel title="Saved Vlogs" items={this.props.vlogs.list} renderFunction={this.renderItem} onClick={this.viewDetails}/>
        <Carousel title="Shared Vlogs" items={this.props.vlogs.list} renderFunction={this.renderItem} onClick={this.viewDetails}/>
      </div>
    </div>
  );
}
}
