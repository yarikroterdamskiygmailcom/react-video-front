import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default class ColorPicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  open = () => this.setState({isOpen: true})

  close = () => this.setState({isOpen: false})

  toggle = () => this.setState({isOpen: !this.state.isOpen})

  setColor = color => this.props.onChange(color)

  renderOption = option =>
    <div
      className={styles.option}
      style={{background: option}}
      onClick={() => this.close() || this.setColor(option)}
    />

  renderOptions = options =>
    <div className={classNames(styles.options, this.state.isOpen && styles.open)}>
      {options.map(this.renderOption)}
    </div>

  render() {
    const {value, options, className} = this.props;
    return (
      <div className={classNames(styles.container, className)}>
        <div className={styles.example} onClick={this.toggle} style={{background: value}}/>
        {this.renderOptions(options)}
      </div>
    );
  }
}
