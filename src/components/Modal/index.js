import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Modal extends Component {

    defaultActions = [
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
      const {className, children} = this.props;
      return (
        <div className={classNames(styles.container, className)}>
          <div className={styles.children}>
            {children}
          </div>
          <div className={styles.actions}>
            {(this.props.actions || this.defaultActions).map(this.renderAction)}
          </div>
        </div>
      );
    }
}
