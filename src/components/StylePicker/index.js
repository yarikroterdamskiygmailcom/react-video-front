import React, {Component} from 'react';
import {Dropdown} from '../../atoms';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import classNames from 'classnames';
import {noop} from 'lodash-es';

@inject('assets')
@observer
export default class StylePicker extends Component {

  componentWillMount() {
    this.props.assets.loadStyles();
  }

  setSelected = i => {
    this.props.onSelect(this.props.assets.styleList[i]);
  }

  renderStyle = ({name, textcolor, backgroundcolor, font, selected}, i) => (
    <div key={`${name}-${i}`} className={classNames(styles.style, selected && styles.selected)} onClick={selected ? noop : () => this.setSelected(this.styles[i])}>
      <div className={styles.styleMeta}>
        <div className={styles.styleName} style={{fontFamily: font}}>{name}</div>
        <div className={styles.fontName}>{font}</div>
      </div>
      <div className={styles.colorGroup}>
        <div className={styles.color} style={{background: textcolor}} />
        <div className={styles.color} style={{background: backgroundcolor}} />
      </div>
    </div>
  )

  render() {
    const {selected, className} = this.props;
    const {styleList} = this.props.assets;
    return (
      <Dropdown
        className={classNames(styles.dropdown, className)}
        label={<div className={styles.label}>Please select a style...</div>}
        onSelect={this.setSelected}
        selected={selected ? this.renderStyle(selected) : null}
      >{styleList.map(this.renderStyle)}</Dropdown>
    );
  }
}
