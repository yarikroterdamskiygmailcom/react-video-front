import React, {Component} from 'react';
import {Modal} from '../';
import {inject, observer} from 'mobx-react';
import styles from './styles.scss';

@inject('project')
@observer
export default class ConfirmProfessional extends Component {

    modalActions = [
      {
        label: 'Cancel',
        func: this.props.onCancel
      },
      {
        label: 'Confirm',
        func: this.props.onConfirm
      }
    ]

    render() {
      return (
        <Modal className={styles.modal} actions={this.modalActions}>
                Are you sure you want to create a
          <div className={styles.prof}>Professional Vlog?</div>
                Additional charges apply.
        </Modal>
      );
    }
}