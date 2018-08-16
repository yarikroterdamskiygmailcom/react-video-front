import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import styles from './styles';

const DragHandle = SortableHandle(() => <FontAwesome className={styles.handle} name="bars"/>);

const SortableItem = SortableElement(({value}) => (
  <div className={styles.item}>
    {value}
    <DragHandle />
  </div>
));

const SortableList = SortableContainer(({items}) => (
  <div className={styles.list}>
    {items.map((value, index) => (
      <SortableItem key={`item-${index}`} index={index} value={value} />
    ))}
  </div>
));

export default class Arranger extends Component {

  render() {
    return (
      <SortableList items={this.props.items} onSortEnd={this.props.onSortEnd} useDragHandle={true} />
    );
  }
}
