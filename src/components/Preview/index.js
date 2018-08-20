import React, {Component} from 'react';
import styles from './styles.scss';

export default class Preview extends Component {

  render() {
    return (
      <div className={styles.container}>
        <video src={this.props.src} autoPlay controls/>
      </div>
    );
  }
}
