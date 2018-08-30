import React, {Component} from 'react';
import styles from './styles.scss';

export default class Overlay extends Component {

  render() {
    return (
      this.props.active && <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.close} onClick={this.props.onClose}>X</div>
        </div>
        <div className={styles.content}>
          {this.props.content}
        </div>
      </div>
    );
  }
}
