import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Preview extends Component {

  render() {
    const {src, start, stop, className} = this.props;
    return (
      <div className={classNames(styles.container, className)}>
        <video className={styles.video} src={(start || stop) ? `${src}#t=${start},${stop}` : src} autoPlay loop controls playsInline/>
      </div>
    );
  }
}
