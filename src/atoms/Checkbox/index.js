import React, {Component} from 'react';
import styles from './styles.scss';
import classNames from 'classnames';
import FontAwesome from 'react-fontawesome';

export default class Checkbox extends Component {

  render() {
    const {value, onChange, className} = this.props;
    return (
      <div className={classNames(styles.container, value && styles.active, className)} onClick={onChange}>
        <FontAwesome className={classNames(styles.check, value && styles.active)} name="check"/>
      </div>
    );
  }
}
