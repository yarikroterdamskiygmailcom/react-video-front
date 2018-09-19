import React, {Component} from 'react';
import {Icon} from '../../atoms';
import {Overlay} from '../';
import {observer, inject} from 'mobx-react';
import styles from './styles.scss';

@inject('vlogDetails')
@observer
export default class DeleteVlog extends Component {

    renderModal = () => (
      <div className={styles.modal}>
        <div>u sure boi</div>
        <div onClick={this.props.vlogDetails.deleteVlog}>si</div>
        <div onClick={this.props.vlogDetails.closeOverlay}>no</div>
      </div>
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
