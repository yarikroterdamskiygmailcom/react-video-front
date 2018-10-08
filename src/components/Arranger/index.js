import React, {Component} from 'react';
import {Icon} from '../../atoms';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import Swipeable from 'react-swipeable';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@inject('vlogEditor')
@observer
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
      icon: 'trim',
      func: this.props.openTrimmer
    },
    lowerThird: {
      label: 'Lower Third',
      icon: 'lowerThird',
      func: this.props.onLowerThird
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

  generateActions = media => {
    if(this.mediaActionsMap[media.mediatype]) {
      return this.mediaActionsMap[media.mediatype];
    }
    throw new Error(`Tried to render media with mediatype ${media.mediatype}, must be one of ${Object.keys(this.mediaActionsMap)}`);
  }

  generateBody = ({thumb, file, videofile, duration, mediatype, trimmed, text, title}, index) => ({
    video: (
      <div className={styles.itemBody}>
        <div className={styles.thumb} onClick={() => this.props.onThumbClick(index)} style={{backgroundImage: `url(${thumb})`}} />
        <div className={classNames(styles.stack, this.state.revealIndex === index && styles.active)}>
          <div className={styles.fileName}>{file || videofile}</div>
          <div className={styles.fileMeta}>{duration} {trimmed && <Icon className={styles.icon} name="trim"/>}</div>
        </div>
      </div>
    ),

    crossfade: (
      <div className={styles.itemBody}>
        <Icon className={styles.bigIcon} name="crossfade" onClick={this.props.vlogEditor.openEditCrossfade(index)}/>
        <div className={classNames(styles.stack, this.state.revealIndex === index && styles.active)}>
          <div className={styles.fileName}>Crossfade</div>
          <div className={styles.fileMeta}>{`Duration: ${duration} seconds`}</div>
        </div>
      </div>
    ),

    title: (
      <div className={styles.itemBody}>
        <Icon className={styles.bigIcon} name="title"/>
        <div className={classNames(styles.stack, this.state.revealIndex === index && styles.active)}>
          <div className={styles.fileName}>Title</div>
          <div className={styles.fileMeta}>{text}</div>
        </div>
      </div>
    ),

    asset: (
      <div className={styles.itemBody}>
        <Icon className={styles.bigIcon} name="branding"/>
        <div className={classNames(styles.stack, this.state.revealIndex === index && styles.active)}>
          <div className={styles.fileName}>Branding</div>
          <div className={styles.fileMeta}>{title}</div>
        </div>
      </div>
    )
  }[mediatype])

  DragHandle = SortableHandle(() => <FontAwesome className={styles.handle} name="bars" />);

  SortableItem = SortableElement(({value, revealIndex}) => (
    <div className={styles.item}>
      <Swipeable
        trackMouse
        className={styles.itemInner}
        onSwipedLeft={() => this.setReveal(revealIndex, 'left')}
        onSwipedRight={() => value.mediatype === 'video' && this.setReveal(revealIndex, 'right')}
      >
        {this.generateBody(value, revealIndex)}
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
          >{this.generateActions(value).map(this.renderAction(index))}</div>
          <this.SortableItem
            key={`item-${index}`}
            index={index}
            revealIndex={index}
            value={value} />
          <div className={classNames(styles.rightActions,
            this.state.revealIndex === index
            && this.state.revealSide === 'left'
            && styles.active)}
          >{this.renderAction(index)(this.actions.delete)}</div>
        </div>
      ))}
    </div>
  ));

  setReveal = (index, side) => {
    this.state.revealSide
      ? this.resetReveal()
      : this.setState({
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

  renderAction = itemIndex => (action, i) =>
    <div key={i} className={styles.action} onClick={() => { action.func(itemIndex); this.resetReveal(); }}>
      <Icon name={action.icon} />
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
