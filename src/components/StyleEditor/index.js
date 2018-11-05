import React, {Component} from 'react';
import {Modal} from '../';
import styles from './styles.scss';
import {Dropdown, Input} from '../../atoms';
import {SketchPicker} from 'react-color';
import {pick} from 'lodash-es';

const fonts = [
  'Arial',
  'Helvetica',
  'Courier',
  'Comic Sans',
  'Times New Roman',
  'Georgia',
  'Impact'
];

export default class StyleEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'New style',
      textColor: '#FFFFFF',
      backgroundColor: '#000000',
      font: 'Arial'
    };
  }

  setName = e => this.setState({name: e.target.value})

  setTextColor = e => this.setState({textColor: e.hex})

  setBackgroundColor = e => this.setState({backgroundColor: e.hex})

  setFont = font => () => this.setState({font})

  save = () => {
    this.props.onSave({
      name: this.state.name,
      textcolor: this.state.textColor,
      backgroundcolor: this.state.backgroundColor,
      font: this.state.font
    }).then(this.props.onClose);
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

    renderSelected = font => (
      <div className={styles.font} style={{fontFamily: font}}>
        {font}
      </div>
    )

    renderFont = font => (
      <div key={font} className={styles.font} style={{fontFamily: font}} onClick={this.setFont(font)}>
        {font}
      </div>
    )

    render() {
      const {name, textColor, backgroundColor, font} = this.state;
      return (
        <Modal actions={this.modalActions}>
          <div
            className={styles.preview}
            style={{color: textColor, background: backgroundColor, fontFamily: font}}
          >
          This is some text.
          </div>
          <Input modal name="Style Name" value={name} onChange={this.setName}/>
          <div className={styles.label}>Font</div>
          <Dropdown
            selected={this.state.font && this.renderSelected(this.state.font)}
          >
            {fonts.map(this.renderFont)}
          </Dropdown>
          <div className={styles.label}>Text Color</div>
          <SketchPicker color={textColor} onChange={this.setTextColor} width="calc(100% - 20px)"/>
          <div className={styles.label}>Background Color</div>
          <SketchPicker color={backgroundColor} onChange={this.setBackgroundColor} width="calc(100% - 20px)"/>
        </Modal>
      );
    }

}
