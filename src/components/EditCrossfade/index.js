import React, {Component} from 'react';
import {Modal} from '../';
import styles from './styles.scss';

export default class EditCrossfade extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: this.props.crossfade.duration
    };
  }

    save = () => {
      this.props.crossfade.duration = this.state.duration;
      this.props.onClose();
    }

    modalActions = [
      {
        label: 'Cancel',
        func: this.props.onClose
      },
      {
        label: 'Save',
        func: this.save
      }
    ]

    setDuration = e => this.setState({duration: e.target.value})

    render() {
      const {duration} = this.state;
      return (
        <Modal actions={this.modalActions}>
          <input min={1} max={5} step={0.1} type="number" value={duration} onChange={this.setDuration}/>
        </Modal>
      );
    }
}
