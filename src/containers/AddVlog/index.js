import React, {Component} from 'react';
import styles from './styles.scss';
import {inject, observer} from 'mobx-react';
import {Toolbar, Arranger, Overlay, Preview} from '../../components';

@inject('session')
@inject('addVlog')
@observer
export default class AddVlog extends Component {

  componentDidMount() {
    const {session, addVlog} = this.props;
    addVlog.initResumable(session.sessionId);
  }

  actions = [
    {
      render: <span id="input">Video</span>
    },
    {
      render: 'Crossfade',
    },
    {
      render: 'Title',
    },
    {
      render: 'Music',
    },
    {
      render: 'Branding element'
    }
  ];

  render() {
    return (
      <div className={styles.container}>
        <Arranger
          items={this.props.addVlog.media}
          onSortEnd={this.props.addVlog.onSortEnd}
          onThumbClick={this.props.addVlog.showOverlay}
          onDelete={this.props.addVlog.deleteMedia}
        />
        <Toolbar actions={this.actions}/>
        {this.props.addVlog.overlay
          && <Overlay
            content={this.props.addVlog.overlay}
            onClose={this.props.addVlog.closeOverlay}
          />}
      </div>
    );
  }
}
