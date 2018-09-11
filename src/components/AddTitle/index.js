import React, {Component} from 'react';
import styles from './styles.scss';
import {Input, Button, ColorPicker} from '../../atoms';
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
      <div className={styles.container}>
        {this.renderExample(text, textColor, backgroundColor)}
        <Input className={styles.input} nameTop fieldName="Text" value={text} onChange={setText} />
        <ColorPicker value={textColor} options={['#FFFFFF', '#000000']} onChange={setTextColor}/>
        <ColorPicker value={backgroundColor} options={['#FFFFFF', '#000000']} onChange={setBackgroundColor}/>
        <div className={styles.actions}>
          <div className={styles.action} onClick={closeOverlay}>Cancel</div>
          <div className={styles.action} onClick={addTitle}>Place</div>
        </div>
      </div>
    );
  }
}
