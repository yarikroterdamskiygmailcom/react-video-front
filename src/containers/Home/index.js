import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {Carousel} from '../../atoms';
import {observer, inject} from 'mobx-react';
import styles from './styles.scss';

@withRouter
@inject('vlogs')
@inject('vlogEditor')
@observer
export default class Home extends Component {

  componentWillMount() {
    this.props.vlogs.loadVlogs();
  }

  openProject = vlog => {
    this.props.vlogEditor.setVlog(vlog);
    this.props.history.push('/edit-vlog');
  }

  renderHighlight = () =>
    <div className={styles.highlight}>

    </div>

  render() {
    return (
      <div className={styles.container}>
        {this.renderHighlight()}
        <div className={styles.carousels}>
          <Carousel title="Saved Vlogs" items={this.props.vlogs.list} onClick={this.openProject}/>
          <Carousel title="Shared Vlogs" items={this.props.vlogs.list} onClick={this.openProject}/>
        </div>
      </div>
    );
  }
}
