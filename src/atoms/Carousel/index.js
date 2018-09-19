import React, {Component} from 'react';
import Swipeable from 'react-swipeable';
import {clamp} from 'lodash-es';
import styles from './styles.scss';

export default class Carousel extends Component {

  constructor(props) {
    super(props);
    this.itemsRef = React.createRef();
    this.width =
      this.state = {
        offset: 0,
      };
  }

  componentDidUpdate() {
    this.width = this.itemsRef.current.scrollWidth;
  }

  swipe = (e, deltaX) => {
    this.setState({
      deltaX
    });
  }

  postSwipe = (e, deltaX) => {
    this.setState({
      offset: this.state.offset - deltaX <= 0 ? this.state.offset - deltaX : 0,
      deltaX: 0
    });
  };

  render() {
    const {offset, deltaX} = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.header}>{this.props.title}</div>
        <Swipeable onSwiping={this.swipe} onSwiped={this.postSwipe} trackMouse>
          <div className={styles.items} ref={this.itemsRef} style={{transform: `translateX(${offset - deltaX}px)`}}>
            {this.props.items.map(this.props.renderFunction)}
          </div>
        </Swipeable>
      </div>
    );
  }
}
