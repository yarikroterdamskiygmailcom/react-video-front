import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
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
      const {fieldName, nameTop, type} = this.props;
      return (
        <div className={styles.container}>
          {nameTop
            ? <div className={styles.fieldName}>{fieldName}</div>
            : null}
          <div className={styles.row}>
            <input type={this.getType()} {...!nameTop && {placeholder: fieldName}}/>
            {type === 'password' && <FontAwesome name="eye" onClick={this.toggleLegible}/>}
          </div>
        </div>
      );
    }
}
