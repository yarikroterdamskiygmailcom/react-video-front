import React, {Component} from 'react';
import Swipeable from 'react-swipeable';
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
    const pixelsPerUnit = width / (max - min);
    const transform = pixelsPerUnit * (value + offset) - (min * pixelsPerUnit);
    return (
      <div ref={this.ref} className={styles.container}>
        <div className={styles.timestamps}>
          <div className={styles.timestamp}>{min.toFixed(2)}s</div>
          <div className={styles.timestamp}>{max.toFixed(2)}s</div>
        </div>
        <div className={styles.wrapper}>
          <Swipeable
            trackMouse
            className={styles.ball}
            onSwiping={this.onSwiping}
            onSwiped={this.onSwiped}
            style={{transform: `translateX(${transform - 22}px)`}}
          >
            <div className={styles.ballLabel}>{(value + offset).toFixed(2)}s</div>
          </Swipeable>
        </div>
      </div>
    );
  }
}
