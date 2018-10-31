import React, {Component} from 'react';
import {Modal} from '../';
import styles from './styles.scss';

export default class ConfirmationPrompt extends Component {

    modalActions = [
      {
        label: 'Cancel',
        func: this.props.onCancel
      },
      {
        label: 'Proceed',
        func: this.props.onProceed
      }
    ]

    render() {
      return (
        <Modal className={styles.modal} actions={this.modalActions}>
          {this.props.body}
        </Modal>
      );
    }
}
