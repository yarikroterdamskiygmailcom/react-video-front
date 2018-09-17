import React, {Component} from 'react';
import styles from './styles.scss';

export default class Overlay extends Component {

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  onClose = e => e.target.isEqualNode(this.ref.current) && this.props.onClose()

  render() {
    return (
      this.props.active && <div ref={this.ref} className={styles.container} onClick={this.onClose}>
        {this.props.content}
      </div>
    );
  }
}
