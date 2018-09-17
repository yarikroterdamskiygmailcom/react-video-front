import React, {Component} from 'react';
import styles from './styles.scss';

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
