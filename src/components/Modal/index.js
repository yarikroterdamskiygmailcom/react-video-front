import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Modal extends Component {

    actions = this.props.action || [
      {
        label: 'Cancel',
        func: this.props.onCancel
      },
      {
        label: 'Place',
        func: this.props.onPlace
      }
    ]

    renderAction = ({label, func}) => (
      <div className={styles.action} onClick={func}>
        {label}
      </div>
    )

    render() {
      return (
        <div className={classNames(styles.container, this.props.className)}>
          <div className={styles.children}>
            {this.props.children}
          </div>
          <div className={styles.actions}>
            {this.actions.map(this.renderAction)}
          </div>
        </div>
      );
    }
}
