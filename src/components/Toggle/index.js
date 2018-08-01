import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Toggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
  }
    toggle = () => this.setState({active: !this.state.active})

    render() {
      return (
        <div className={classNames(styles.container, this.state.active && styles.active)} onClick={this.toggle}>
          <div className={classNames(styles.ball, this.state.active && styles.active)}/>
        </div>
      );
    }
}
