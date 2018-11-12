import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      legible: !props.type === 'password'
    };
  }

  getType = () => this.props.type === 'password'
    ? this.state.legible
      ? 'text'
      : 'password'
    : this.props.type || 'text'

  toggleLegible = () => this.setState({legible: !this.state.legible})

  render() {
    const {name, modal, field, auth, className, inputRef, ...props} = this.props;

    if (modal || field || auth) {
      return (
        <div className={classNames(styles.container, modal && styles.modal, field && styles.field, auth && styles.auth, className)}>
          {name && <div className={styles.label}>{name}</div>}
          <input ref={inputRef} className={styles.input} {...props} />
        </div>
      );
    }

    throw new Error('Dude specify an input style');

  }
}
