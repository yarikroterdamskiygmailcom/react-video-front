import React, {Component} from 'react';
import styles from './styles.scss';
import {StylePicker, Modal, Overlay, AddBrandingElement} from '../';
import {Toggle} from '../../atoms';

export default class AddTitle extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.title ? {...this.props.title} : {
      text: '',
      asset: null,
      overlayActive: false
    };
  }

  save = () => {
    this.props.onSave({
      mediatype: 'title',
      text: this.state.text,
      style: this.state.style,
      ...this.state.asset ? {asset: this.state.asset} : {}
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

  selectAsset = asset => this.setState({asset})

  clearAsset = () => this.setState({asset: null})

  closeOverlay = () => this.setState({overlayActive: false})

  generateExampleStyle = ({textcolor, backgroundcolor, font}) => ({
    color: textcolor,
    background: this.state.asset ? `url(${this.state.asset.thumb})` : backgroundcolor,
    fontFamily: font
  })

  openOverlay = () => this.setState({overlayActive: true});

  renderExample = () => {
    const {text, style} = this.state;
    return (
      <div className={styles.example} style={style ? this.generateExampleStyle(style) : {}}>
        {text}
      </div>
    );
  }

  renderAsset = asset => (
    <div className={styles.asset}>
      <img className={styles.thumb} src={asset.thumb} />
      <div className={styles.meta}>
        <div>{asset.file}</div>
        <div>{asset.type}</div>
      </div>
    </div>
  )

  render() {
    const {text, asset, overlayActive} = this.state;
    return (
      <Modal className={styles.modal} actions={this.modalActions}>
        {this.renderExample()}
        <div className={styles.label}>Text</div>
        <textarea className={styles.textarea} value={text} onChange={this.setText} placeholder="Enter your text here!" />
        <div className={styles.label}>Style</div>
        <StylePicker
          className={styles.stylePicker}
          onSelect={this.setSelection}
          selected={this.state.style}
        />
        <Toggle className={styles.toggle} label="Asset Background" value={asset} onChange={asset ? this.clearAsset : this.openOverlay} />
        {asset && this.renderAsset(asset)}
        <Overlay active={overlayActive}>
          <AddBrandingElement onClose={this.closeOverlay} onSave={this.selectAsset} />
        </Overlay>
      </Modal>
    );
  }
}
