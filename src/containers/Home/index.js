import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {Carousel} from '../../atoms';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@withRouter
@inject('session')
@inject('vlogs')
@observer
export default class Home extends Component {

  componentWillMount() {
    this.props.vlogs.loadVlogs(this.props.session.sessionId);
  }

  openProject = () => this.props.history.push('/edit-vlog')

  render() {
    return (
      <div className={styles.container}>
        <Carousel title="Saved Vlogs" items={this.props.vlogs.list} onClick={this.openProject}/>
      </div>
    );
  }
}
