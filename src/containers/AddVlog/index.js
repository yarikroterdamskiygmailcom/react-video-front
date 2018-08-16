import React, {Component} from 'react';
import styles from './styles.scss';
import {inject, observer} from 'mobx-react';
import {Toolbar, Arranger} from '../../components';

@inject('addVlog')
@observer
export default class AddVlog extends Component {

  actions = [
    {
      label: 'Video',
      fn:
    },
    {
      label: 'Crossfade',
    },
    {
      label: 'Title',
    },
    {
      label: 'Music',
    },
    {
      label: 'Branding element'
    }
  ];

  render() {
    return (
      <div className={styles.container}>
        <Arranger items={this.props.addVlog.media} onSortEnd={this.props.addVlog.onSortEnd}/>
        <Toolbar actions={actions}/>
      </div>
    );
  }
}
