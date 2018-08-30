import React, {Component} from 'react';
import styles from './styles.scss';
import {Input, Button} from '../../atoms';
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
        <div className={styles.header}>Add Title</div>
        {this.renderExample(text, textColor, backgroundColor)}
        <Input nameTop fieldName="Text" value={text} onChange={setText} />
        <div className={styles.header}>Style</div>
        <div className={styles.header}>Text color</div>
        <input type="color" value={textColor} onChange={setTextColor} />
        <div className={styles.header}>Background color</div>
        <input type="color" value={backgroundColor} onChange={setBackgroundColor} />
        <div className={styles.actions}>
          <Button text="Place" fn={addTitle}/>
          <Button text="Cancel" fn={closeOverlay}/>
        </div>
      </div>
    );
  }
}
