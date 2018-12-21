import React, {Component} from 'react';
import {Modal, Blurring, AddOverlay} from '../';
import {pick} from 'lodash-es';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@inject('overlay')
@observer
export default class Configure extends Component {

  modalActions = [
    {
      label: 'Cancel',
      func: this.props.onClose
    },
    {
      label: 'Done',
      func: this.props.onClose
    }
  ]

  options = [
    {
      name: 'Facial Blurring',
      desc: '',
      func: this.props.overlay.openOverlay(Blurring)({video: this.props.video})
    },
    {
      name: 'Overlay',
      desc: '',
      func: this.props.overlay.openOverlay(AddOverlay)({video: this.props.video})
    }
  ]

  renderOption = ({name, desc, func}) => (
    <div className={styles.option} onClick={func}>
      <div className={styles.name}>{name}</div>
      <div className={styles.desc}>{desc}</div>
    </div>
  )

  render() {
    return (
      <Modal actions={this.modalActions}>
        <div className={styles.options}>
          {this.options.map(this.renderOption)}
        </div>
      </Modal>
    );
  }
}
