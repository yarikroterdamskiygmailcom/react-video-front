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
      selectedIndex: 0,
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

  setSelection = index => () => this.setState({...this.presets[index], selectedIndex: index})

  toggleDropdown = () => this.setState({dropdownOpen: !this.state.dropdownOpen})

  generateExampleStyle = (textColor, backgroundColor, font) => ({
    color: textColor,
    background: backgroundColor,
    fontFamily: font
  })

  renderExample = () => {
    const {textcolor, backgroundcolor, font, text} = this.state;
    return (
      <div className={styles.example} style={this.generateExampleStyle(textcolor, backgroundcolor, font)}>
        {text}
      </div>
    );
  }

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
    const {text, dropdownOpen} = this.state;
    return (
      <Modal className={styles.modal} actions={this.modalActions}>
        {this.renderExample()}
        <input className={styles.input} value={text} onChange={this.setText} placeholder="Enter your text here!"/>
        <Dropdown
          label="Please select a style..."
          isOpen={dropdownOpen}
          toggleOpen={this.toggleDropdown}
          onSelect={this.setSelection}
          selectedIndex={this.state.selectedIndex}
        >
          {this.presets.map(this.renderPreset)}
        </Dropdown>
      </Modal>
    );
  }
}
