import React from 'react';
import styles from './styles.scss';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';

const Toast = ({className, children, active, onClose}) => (
  <div className={classNames(styles.container, active && styles.active, className)}>
    <div className={styles.content}>
      {children}
    </div>
    <FontAwesome className={styles.close} name="times" onClick={onClose}/>
  </div>
);

export default Toast;
