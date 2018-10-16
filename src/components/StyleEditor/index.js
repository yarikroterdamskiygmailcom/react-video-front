import React, {Component} from 'react';
import {Modal} from '../';
import styles from './styles.scss';
import {Dropdown} from '../../atoms';

const fonts = [
  'Arial',
  'Helvetica',
  'Courier',
  'Comic Sans'
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
          >
            <input value={filter} onChange={this.setFilter}/>
            {fonts.filter(font => font.toLowerCase().includes(filter.toLowerCase())).map(this.renderFont)}
          </Dropdown>
        </Modal>
      );
    }

}
