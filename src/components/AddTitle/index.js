import React, {Component} from 'react';
import styles from './styles.scss';
import {Dropdown} from '../../atoms';
import {Modal} from '../';
import {observer, inject} from 'mobx-react';

@inject('vlogs')
@observer
export default class AddTitle extends Component {
  constructor(props) {
    super(props);
    this.presets = props.vlogs.userPrefs.title;
    this.state = this.props.title ? {...this.props.title} : {
      dropdownOpen: false,
      text: '',
      ...this.presets[0]
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

  setText = e => this.setState({text: e.target.value})

  setSelection = index => () => this.setState({...this.presets[index]})

  toggleDropdown = () => this.setState({dropdownOpen: !this.state.dropdownOpen})

  generateExampleStyle = (textColor, backgroundColor) => ({
    color: textColor,
    background: backgroundColor
  })

  renderExample = (text, textColor, backgroundColor) => (
    <div className={styles.example} style={this.generateExampleStyle(textColor, backgroundColor)}>
      {text}
    </div>
  )

  renderPreset = ({name, textcolor, backgroundcolor, font, align}) => (
    <div className={styles.preset}>
      <div className={styles.presetName} style={{fontFamily: font}}>{name}</div>
      <div className={styles.colorGroup}>
        <div className={styles.color} style={{background: textcolor}}/>
        <div className={styles.color} style={{background: backgroundcolor}}/>
      </div>
    </div>
  )

  render() {
    const {text, textcolor, backgroundcolor, dropdownOpen} = this.state;
    return (
      <Modal className={styles.modal} actions={this.modalActions}>
        {this.renderExample(text, textcolor, backgroundcolor)}
        <input className={styles.input} value={text} onChange={this.setText} placeholder="Enter your text here!"/>
        <Dropdown label="Please select a style..." isOpen={dropdownOpen} toggleOpen={this.toggleDropdown} onSelect={this.setSelection}>
          {this.presets.map(this.renderPreset)}
        </Dropdown>
      </Modal>
    );
  }
}
