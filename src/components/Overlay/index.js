import React, {Component} from 'react';
import styles from './styles.scss';

export default class Overlay extends Component {

  render() {
    return (
      <div className={styles.container} onClick={this.props.onClose}>
        <div className={styles.content}>
          {this.props.content}
        </div>
      </div>
    );
  }
}
