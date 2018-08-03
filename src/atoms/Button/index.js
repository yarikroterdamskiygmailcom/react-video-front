import React, {Component} from 'react';
import styles from './styles.scss';

export default class Button extends Component {

  render() {
    const {fn, text} = this.props;
    return (
      <div className={styles.container} onClick={fn}>
        {text}
      </div>
    );
  }
}
