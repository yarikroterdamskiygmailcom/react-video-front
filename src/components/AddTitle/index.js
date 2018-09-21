import React, {Component} from 'react';
import styles from './styles.scss';
import {Input, Button, ColorPicker} from '../../atoms';
import {Modal} from '../';
import {observer, inject} from 'mobx-react';

@inject('vlogEditor')
@observer
export default class AddTitle extends Component {

  generateExampleStyle = (textColor, backgroundColor) => ({
    color: textColor,
    background: backgroundColor
  })

  renderExample = (text, textColor, backgroundColor) => (
    <div className={styles.example} style={this.generateExampleStyle(textColor, backgroundColor)}>
      {text}
    </div>
  )

  render() {
    const {text, textColor, backgroundColor} = this.props.vlogEditor.title;
    const {setText, setTextColor, setBackgroundColor, addTitle, closeOverlay} = this.props.vlogEditor;
    return (
      <Modal className={styles.modal} onPlace={addTitle} onCancel={closeOverlay}>
        {this.renderExample(text, textColor, backgroundColor)}
        <input className={styles.input} value={text} onChange={setText}/>
        <ColorPicker value={textColor} options={['#FFFFFF', '#000000']} onChange={setTextColor}/>
        <ColorPicker value={backgroundColor} options={['#FFFFFF', '#000000']} onChange={setBackgroundColor}/>
      </Modal>
    );
  }
}
