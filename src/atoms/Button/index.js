import React, {Component} from 'react';
import {noop} from 'lodash-es';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Button extends Component {

  render() {
    const {fn, text, highlight, disabled} = this.props;
    return (
      <div className={classNames(styles.container, highlight && styles.active)} onClick={disabled ? noop : fn}>
        {text}
      </div>
    );
  }
}
