import React, {Component} from 'react';
import {isNumber} from 'lodash-es';
import Swipeable from 'react-swipeable';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Slider extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      width: 1,
    };
  }

  componentDidMount() {
    this.setState({width: this.ref.current.offsetWidth});
  }

  onSwiping = (e, deltaX) => {
    const {value, min, max} = this.props;
    const {width} = this.state;
    const deltaPerPixel = (max - min) / width;
    const newOffset = -deltaX * deltaPerPixel;
    const newValue = newOffset + value;

    if(newValue > max || newValue < min) {
      return;
    }

    this.props.onSwiping(newOffset);
  }

  onSwiped = () => this.props.onSwiped()

  render() {
    const {value, offset, min, max} = this.props;
    const {width} = this.state;
    return (
      <div ref={this.ref} className={styles.container}>
        <div className={styles.timestamp}>{(value + offset).toFixed(2)}s</div>
        <div className={styles.wrapper}>
          <Swipeable
            trackMouse
            className={styles.ball}
            onSwiping={this.onSwiping}
            onSwiped={this.onSwiped}
            style={{transform: `translateX(${(width * (value + offset) / (max - min) - 22)}px)`}}
          />
        </div>
      </div>
    );
  }
}
