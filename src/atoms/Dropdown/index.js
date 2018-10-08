import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Dropdown extends Component {

    renderOption = (option, index) => (
      <div className={styles.option} onClick={this.props.onSelect(index)}>
        {option}
      </div>
    )

    render() {
      const {label, isOpen, toggleOpen, children, className} = this.props;
      return (
        <div className={classNames(styles.container, className)} onClick={toggleOpen}>
          <div className={styles.label}>{label}</div>
          {isOpen && <div className={classNames(styles.options, isOpen && styles.active)}>
            {React.Children.map(children, this.renderOption)}
          </div>}
        </div>
      );
    }
}
