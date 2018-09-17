import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';

export default class ButtonGroup extends Component {

    onChange = value => () => this.props.onChange(value)

    renderOption = ({render, value}) => (
      <div className={styles.option} onClick={this.onChange(value)}>
        {render}
        {this.props.value === value && <FontAwesome className={styles.check} name="check"/>}
      </div>
    )

    render() {
      const {options} = this.props;
      return (
        [
          ...options.map(this.renderOption)
        ]
      );
    }
}
