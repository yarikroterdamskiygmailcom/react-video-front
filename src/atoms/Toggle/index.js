import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Toggle extends Component {

    toggle = () => {
      this.props.onChange(!this.props.value);
    }

    render() {
      const {label, value} = this.props;
      return (
        <div className={styles.container}>
          <div className={styles.label}>{label}</div>
          <div className={classNames(styles.slider, value && styles.active)} onClick={this.toggle}>
            <div className={classNames(styles.ball, value && styles.active)}/>
          </div>
        </div>
      );
    }
}
