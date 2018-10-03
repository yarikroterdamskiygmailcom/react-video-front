import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';

export default class Overlay extends Component {

  onClose = () => this.props.onClose()

  render() {
    const {active, content} = this.props;
    return (
      active && <div className={styles.container}>
        {content}
        <div className={styles.close} onClick={this.onClose}>
          <FontAwesome name="times"/>
        </div>
      </div>
    );
  }
}
