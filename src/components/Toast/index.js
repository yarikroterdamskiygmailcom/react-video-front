import React, {Component} from 'react';
import styles from './styles.scss';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import {observer, inject} from 'mobx-react';

@inject('overlay')
@observer
export default class Toast extends Component {

  render() {
    const {className, active, onClose} = this.props;
    const children = this.props.overlay.toastContent;
    return (
      <div className={classNames(styles.container, active && styles.active, className)}>
        <div className={styles.content}>
          {children}
        </div>
        <FontAwesome className={styles.close} name="times" onClick={onClose} />
      </div>
    );
  }
}
