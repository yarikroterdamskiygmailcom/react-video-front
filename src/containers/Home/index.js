import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {Carousel} from '../../atoms';
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

  openProject = vlog => {
    this.props.vlogEditor.setVlog(vlog);
    this.props.history.push('/edit-vlog');
  }

  viewDetails = vlog => {
    this.props.vlogDetails.setVlog(vlog);
    this.props.history.push('/vlog-details');
  }

  renderHighlight = () =>
    <div className={styles.highlight}>

    </div>

renderItem = item =>
  <div key={item.thumb} className={styles.item} onClick={() => this.viewDetails(item)}>
    <div className={styles.thumb} style={{background: `url(${item.thumb})`}}/>
    <div className={styles.title}>{item.title || 'Untitled'}</div>
    <div className={styles.duration}>{item.duration}</div>
  </div>

render() {
  return (
    <div className={styles.container}>
      {this.renderHighlight()}
      <div className={styles.carousels}>
        <Carousel title="Saved Vlogs" items={this.props.vlogs.list} renderFunction={this.renderItem} onClick={this.viewDetails}/>
        <Carousel title="Shared Vlogs" items={this.props.vlogs.list} renderFunction={this.renderItem} onClick={this.viewDetails}/>
      </div>
    </div>
  );
}
}
