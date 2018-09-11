import React, {Component} from 'react';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@inject('vlogEditor')
@observer
export default class Preview extends Component {

  render() {
    const {src} = this.props;
    return (
      <div className={styles.container}>
        <video className={styles.video} src={src} autoPlay loop controls/>
      </div>
    );
  }
}
