import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Toggle extends Component {

    toggle = () => {
      this.props.onChange(!this.props.value);
    }

    render() {
      return (
        <div className={classNames(styles.container, this.props.value && styles.active)} onClick={this.toggle}>
          <div className={classNames(styles.ball, this.props.value && styles.active)}/>
        </div>
      );
    }
}
