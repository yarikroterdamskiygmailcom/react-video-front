import React, {Component} from 'react';
import styles from './styles.scss';

export default class Overlay extends Component {

  render() {
    return (
      this.props.active && <div className={styles.container}>
        {this.props.content}
      </div>
    );
  }
}
