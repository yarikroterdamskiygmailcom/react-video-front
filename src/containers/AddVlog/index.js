import React, {Component} from 'react';
import styles from './styles.scss';
import {inject, observer} from 'mobx-react';
import {Toolbar, Arranger} from '../../components';

@inject('addVlog')
@observer
export default class AddVlog extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.container}>
        <Arranger items={this.props.addVlog.media}/>
        <Toolbar actions={this.props.addVlog.actions}/>
      </div>
    );
  }
}
