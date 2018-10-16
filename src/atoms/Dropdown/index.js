import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  toggleOpen = e => {
    e.stopPropagation();
    this.setState({isOpen: !this.state.isOpen});
  }

  renderItem = (item, i) => React.cloneElement(item, {onClick: () => this.props.onSelect(i)})

  render() {
    const {isOpen} = this.state;
    const {label, selected, children, className} = this.props;
    return (
      <div className={classNames(styles.container, className)} onClick={this.toggleOpen}>
        {isOpen && <div className={styles.overlay} onClick={this.toggleOpen}/>}
        {selected
          ? selected
          : <div className={styles.label}>{label}</div>}
        <div className={classNames(styles.options, !isOpen && styles.closed)}>
          {isOpen && React.Children.map(children, this.renderItem)}
        </div>
      </div>
    );
  }
}
