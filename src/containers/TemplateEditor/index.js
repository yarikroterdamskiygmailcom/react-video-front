import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {isEmpty} from 'lodash-es';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import {Icon, Checkbox, Input, SwipeItem} from '../../atoms';
import {Overlay} from '../../components';
import styles from './styles.scss';

const fieldOptions = [
  {
    type: 'video',
    icon: 'camera',
  },
  {
    type: 'asset',
    icon: 'branding'
  },
  {
    type: 'title',
    icon: 'title'
  },

];

const columns = [
  {
    name: 'type',
    width: '8%'
  },
  {
    name: 'title',
    width: '30%'
  },
  {
    name: 'description',
    width: '55%'
  },
  {
    name: 'fixed',
    width: '10%'
  }
];

@inject('templateEditor')
@observer
export default class TemplateEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      revealIndex: null,
      revealSide: null
    };
  }

  openMenu = () => this.setState({isOpen: true})

  closeMenu = () => this.setState({isOpen: false})

  addField = field => () => {
    this.props.templateEditor.addField(field);
    this.closeMenu();
  }

  deleteField = i => () => this.props.templateEditor.deleteField(i);

  updateField = (index, changes) => e => {
    if (e) {
      this.props.templateEditor.updateField(index, {[changes]: e.target.value});
    } else {
      this.props.templateEditor.updateField(index, changes);
    }
  }

  setReveal = i => side => () => this.setState({revealIndex: i, revealSide: side})

  resetReveal = () => {
    this.setState({
      revealIndex: null,
      revealSide: null
    });
  }

    getSwipeActions = i => ({
      right: [
        {
          label: <div className={styles.swipeAction}><Icon name="trash"/>Delete</div>,
          func: this.deleteField(i)
        }
      ]
    })

  renderColumn = column => (
    <div className={styles.column} style={{width: column.width}}>
      {column.name}
    </div>
  )

  renderField = (field, i) => (
    <SwipeItem
      className={styles.field}
      actions={this.getSwipeActions(i)}
      afterAction={this.resetReveal}
      onSwipe={this.setReveal(i)}
      reveal={i === this.state.revealIndex && this.state.revealSide}
    >
      <Icon className={styles.icon} name={field.icon} />
      <Input field className={styles.title} value={field.title} placeholder="What?" onChange={this.updateField(i, 'title')} />
      <Input field className={styles.description} value={field.description} placeholder="Short desc" onChange={this.updateField(i, 'description')} />
      <Checkbox className={styles.fixed} value={field.fixed} onChange={this.updateField(i, {fixed: !field.fixed})} />
    </SwipeItem>
  )

  renderOption = option => (
    <div className={styles.option} onClick={this.addField(option)}>
      {option.type}
    </div>
  )

  render() {
    const {template, saveTemplate} = this.props.templateEditor;
    const {isOpen} = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          {columns.map(this.renderColumn)}
        </div>
        <div className={styles.fields}>
          {template.map(this.renderField)}
        </div>
        <div className={styles.tools}>
          <div className={classNames(styles.tool, styles.add)} onClick={this.openMenu}>
            <FontAwesome name="plus" />
          </div>
          <div onClick={saveTemplate}>
            save
          </div>
        </div>
        <Overlay className={styles.overlay} active={isOpen} onClose={this.closeMenu}>
          <div className={styles.options}>
            {fieldOptions.map(this.renderOption)}
          </div>
        </Overlay>
      </div>
    );
  }
}
