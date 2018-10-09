import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default class ProgressBar extends Component {
  render() {
    const {className} = this.props;
    const progress = Math.floor(this.props.progress);
    return (
      <div className={classNames(styles.container, className)}>
        <div className={styles.label}>{`Uploading... (${progress}%)`}</div>
        <div className={styles.bar} style={{width: `${progress}%`}}/>
      </div>
    );
  }
}
