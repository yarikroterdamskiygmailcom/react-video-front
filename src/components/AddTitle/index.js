import React, {Component} from 'react';
import styles from './styles.scss';
import {StylePicker, Modal} from '../';

export default class AddTitle extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.title ? {...this.props.title} : {
      text: '',
    };
  }

  save = () => {
    this.props.onSave({
      mediatype: 'title',
      text: this.state.text,
      style: this.state.style
    });
    this.props.onClose();
  }

  modalActions = [
    {
      label: 'Cancel',
      func: this.props.onClose
    },
    {
      label: this.props.title ? 'Save' : 'Place',
      func: this.save
    }
  ]

  setText = e => this.setState({text: e.target.value})

  setSelection = style => this.setState({style})

  generateExampleStyle = ({textcolor, backgroundcolor, font}) => ({
    color: textcolor,
    background: backgroundcolor,
    fontFamily: font
  })

  renderExample = () => {
    const {text, style} = this.state;
    return (
      <div className={styles.example} style={style ? this.generateExampleStyle(style) : {}}>
        {text}
      </div>
    );
  }

  render() {
    const {text} = this.state;
    return (
      <Modal className={styles.modal} actions={this.modalActions}>
        {this.renderExample()}
        <div className={styles.label}>Text</div>
        <textarea className={styles.textarea} value={text} onChange={this.setText} placeholder="Enter your text here!"/>
        <div className={styles.label}>Style</div>
        <StylePicker
          onSelect={this.setSelection}
          selected={this.state.style}
        />
      </Modal>
    );
  }
}
