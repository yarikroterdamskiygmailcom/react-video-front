import React, {Component} from 'react';
import {Icon} from '../../atoms';
import {Overlay, Modal} from '../';
import {observer, inject} from 'mobx-react';
import styles from './styles.scss';

@inject('vlogDetails')
@observer
export default class DeleteVlog extends Component {

  componentWillUnmount() {
    this.props.vlogDetails.closeOverlay();
  }

  actions = [
    {
      label: 'Cancel',
      func: this.props.vlogDetails.closeOverlay
    },
    {
      label: 'Delete',
      func: this.props.vlogDetails.deleteVlog
    }
  ]

    renderModal = () => (
      <Modal className={styles.modal} actions={this.actions} >
        Are you sure you want to delete this vlog?
      </Modal>
    )

    render() {
      const {confirmDelete, overlayActive, overlayContent, closeOverlay} = this.props.vlogDetails;
      return (
        <div className={styles.container}>
          <Icon name="trash" onClick={confirmDelete(this.renderModal())}/>
          <Overlay className={styles.overlay} active={overlayActive} content={overlayContent} onClose={closeOverlay}/>
        </div>
      );
    }
}
