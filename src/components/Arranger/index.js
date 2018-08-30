import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import Swipeable from 'react-swipeable';
import styles from './styles';

export default class Arranger extends Component {

  constructor(props) {
    super(props);
    this.state = {
      revealIndex: null,
      revealSide: null,
    };
  }

  actions = {
    trim: {
      label: 'Trim',
      icon: 'cut',
      func: this.props.openTrimmer
    },
    lowerThird: {
      label: 'Lower Third',
      icon: 'tag',
      func: () => null
    },
    delete: {
      label: 'Delete',
      icon: 'trash',
      func: this.props.onDelete
    }
  }

  mediaActionsMap = {
    video: [this.actions.trim, this.actions.lowerThird],
    crossfade: [],
    title: [],
    asset: []
  }

  generateActions = media => this.mediaActionsMap[media.type]

  getMediaLabel = type => ({
    crossfade: <div><FontAwesome name="random" />Crossfade</div>,
    title: <div><FontAwesome name="font" />Title</div>,
    asset: <div><FontAwesome name="fire" />Branding Element</div>
  }[type])

  itemBody = ({thumb, file, duration, type}, index) => (
    <div className={styles.itemBody}>
      <div className={styles.thumb} onClick={() => this.props.onThumbClick(index)} style={{background: `url(${thumb})`}} />
      <div className={styles.stack}>
        <div className={styles.fileName}>{file || this.getMediaLabel(type)}</div>
        <div className={styles.fileDuration}>{duration}</div>
      </div>
    </div>
  )

  DragHandle = SortableHandle(() => <FontAwesome className={styles.handle} name="bars" />);

  SortableItem = SortableElement(({value, revealIndex}) => (
    <div className={styles.item}>
      <Swipeable
        trackMouse
        className={styles.itemInner}
        onSwipedLeft={() => this.setReveal(revealIndex, 'left')}
        onSwipedRight={() => this.setReveal(revealIndex, 'right')}
      >
        {this.itemBody(value, revealIndex)}
      </Swipeable>
      <this.DragHandle />
    </div>
  ));

  SortableList = SortableContainer(({items}) => (
    <div className={styles.list}>
      {items.map((value, index) => (
        <div key={index} className={styles.itemContainer}>
          <div className={classNames(styles.leftActions,
            this.state.revealIndex === index
            && this.state.revealSide === 'right'
            && styles.active)}
          >{this.generateActions(value).map(this.renderAction)}</div>
          <this.SortableItem
            key={`item-${index}`}
            index={index}
            revealIndex={index}
            value={value} />
          <div className={classNames(styles.rightActions,
            this.state.revealIndex === index
            && this.state.revealSide === 'left'
            && styles.active)}
          >{this.renderAction(this.actions.delete, index)}</div>
        </div>
      ))}
    </div>
  ));

  setReveal = (index, side) => {
    this.resetReveal();
    this.setState({
      revealIndex: index,
      revealSide: side
    });
  }

  resetReveal = () => {
    this.setState({
      revealIndex: null,
      revealSide: null
    });
  }

  renderAction = (action, i) =>
    <div key={i} className={styles.action} onClick={() => { action.func(i); this.resetReveal(); }}>
      <FontAwesome name={action.icon} />
      <div>{action.label}</div>
    </div>

  render() {
    return (
      <this.SortableList
        items={this.props.items}
        onSortEnd={this.props.onSortEnd}
        onSortStart={this.resetReveal}
        useDragHandle={true}
      />
    );
  }
}
