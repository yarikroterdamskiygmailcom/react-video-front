import React, {Component} from 'react';
import {Carousel} from '../../atoms';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@inject('session')
@inject('videos')
@observer
export default class Home extends Component {

  componentWillMount() {
    this.props.videos.loadVideos(this.props.session.sessionId);
  }

  render() {
    return (
      <div className={styles.container}>
        <Carousel title="Saved Vlogs" items={this.props.videos.list}/>
        <Carousel title="Saved Vlogs" items={this.props.videos.list}/>
        <Carousel title="Saved Vlogs" items={this.props.videos.list}/>
      </div>
    );
  }
}
