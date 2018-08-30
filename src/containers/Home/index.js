import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {Carousel} from '../../atoms';
import {observer, inject} from 'mobx-react';
import styles from './styles.scss';

@withRouter
@inject('session')
@inject('vlogs')
@inject('vlogEditor')
@observer
export default class Home extends Component {

  componentWillMount() {
    this.props.vlogs.loadVlogs(this.props.session.sessionId);
  }

  openProject = vlog => {
    this.props.vlogEditor.setVlog(vlog);
    this.props.history.push('/edit-vlog');
  }

  render() {
    return (
      <div className={styles.container}>
        <Carousel title="Saved Vlogs" items={this.props.vlogs.list} onClick={this.openProject}/>
      </div>
    );
  }
}
