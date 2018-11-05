import React, {Component} from 'react';
import styles from './styles.scss';
import Swipeable from 'react-swipeable';
import classNames from 'classnames';

export default class SwipeItem extends Component {

    getActionsWidth = side => side === this.props.reveal
      ? `${this.props.actions[side].length * 80}px`
      : '0px'

      renderAction = (action, i) => (
        <div key={i} className={styles.action} onClick={action.func}>
          {action.label}
        </div>
      )

      render() {
        const {onSwipe, actions: {left, right}, children, className} = this.props;
        return (
          <div className={classNames(styles.container, className)}>
            {left && <div className={styles.actions} style={{width: this.getActionsWidth('left')}}>
              {left.map(this.renderAction)}
            </div>}
            <Swipeable
              trackMouse
              className={className}
              onSwipedLeft={onSwipe('right')}
              onSwipedRight={onSwipe('left')}
            >
              {children}
            </Swipeable>
            {right && <div className={styles.actions} style={{width: this.getActionsWidth('right')}}>
              {right.map(this.renderAction)}
            </div>}
          </div>

        );
      }
}
