import React, {Component} from 'react';
import {Modal, Blur} from '../';
import {pick} from 'lodash-es';
import styles from './styles.scss';

export default class Configure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };
  }

    setSelection = value => () => this.setState({selected: value})

    clearSelection = () => this.setState({selected: null})

    save = () => {
      this.props.onSave();
    }

    getModalActions = () => (
      this.state.selected
        ? [
          {
            label: 'Back',
            func: this.clearSelection
          },
          {
            label: 'Save',
            func: this.clearSelection
          }
        ]

        : [
          {
            label: 'Cancel',
            func: this.props.onClose
          },
          {
            label: 'Save',
            func: this.save
          }
        ]
    )

    options = [
      {
        name: 'Facial Blurring',
        desc: '',
        value: 'blurring',
        component: Blur
      }
    ]

    renderSelection = () => {
      const Render = this.options.find(option => option.value === this.state.selected).component;
      return <Render {...pick(this.props, ['video'])}/>;
    }

    renderOption = ({name, desc, value}) => (
      <div className={styles.option} onClick={this.setSelection(value)}>
        <div className={styles.name}>{name}</div>
        <div className={styles.desc}>{desc}</div>
      </div>
    )

    renderOptions = () => (
      <div className={styles.options}>
        {this.options.map(this.renderOption)}
      </div>
    )

    render() {
      const {selected} = this.state;
      return (
        <Modal actions={this.getModalActions()}>
          {selected
            ? this.renderSelection()
            : this.renderOptions()
          }
        </Modal>
      );
    }
}
