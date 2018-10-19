import React, {Component} from 'react';
import {Modal} from '../';
import styles from './styles.scss';
import {Dropdown} from '../../atoms';
import {ChromePicker} from 'react-color';

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
      filter: '',
      font: 'Arial'
    };
  }

  setName = e => this.setState({name: e.target.value})

  setTextColor = e => this.setState({textColor: e.hex})

  setBackgroundColor = e => this.setState({backgroundColor: e.hex})

    setFilter = e => {
      e.stopPropagation();
      this.setState({filter: e.target.value});
    }

  setFont = i => this.setState({font: fonts[i], filter: ''})

    modalActions = [
      {
        label: 'Cancel',
        func: this.props.onClose
      },
      {
        label: 'Save',
        func: this.props.onSave
      }
    ]

    renderFont = (font, selected) => (
      <div className={styles.font} style={{fontFamily: font}}>
        {font}
      </div>
    )

    render() {
      const {name, textColor, backgroundColor, filter, font} = this.state;
      return (
        <Modal actions={this.modalActions}>
          <div
            className={styles.preview}
            style={{color: textColor, background: backgroundColor, fontFamily: font}}
          >
          This is some text.
          </div>
          <input className={styles.input} value={name} onChange={this.setName}/>
          <Dropdown
            label="Please choose a font..."
            selected={this.renderFont(this.state.font)}
            onSelect={this.setFont}
            hasFilter
          >
            <input value={filter} onChange={this.setFilter} placeholder="Search..."/>
            {fonts.filter(font => font.toLowerCase().includes(filter.toLowerCase())).map(this.renderFont)}
          </Dropdown>
          <ChromePicker color={textColor} onChange={this.setTextColor}/>
          <ChromePicker color={backgroundColor} onChange={this.setBackgroundColor}/>
        </Modal>
      );
    }

}
