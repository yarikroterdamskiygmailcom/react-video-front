import React, {Component} from 'react';
import styles from './styles.scss';
import {ColorPicker} from '../../atoms';
import {Modal} from '../';

export default class AddTitle extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.title ? {...this.props.title} : {
      text: '',
      textcolor: '#FFFFFF',
      backgroundcolor: '#000000',
      font: 'Arial'
    };
  }

  save = () => {
    this.props.onSave({
      mediatype: 'title',
      ...this.state
    });
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

  generateExampleStyle = (textColor, backgroundColor) => ({
    color: textColor,
    background: backgroundColor
  })

  renderExample = (text, textColor, backgroundColor) => (
    <div className={styles.example} style={this.generateExampleStyle(textColor, backgroundColor)}>
      {text}
    </div>
  )

  setText = e => this.setState({text: e.target.value})

  render() {
    const {text, textcolor, backgroundcolor} = this.state;
    return (
      <Modal className={styles.modal} actions={this.modalActions}>
        {this.renderExample(text, textcolor, backgroundcolor)}
        <input className={styles.input} value={text} onChange={this.setText} placeholder="Enter your text here!"/>
      </Modal>
    );
  }
}
