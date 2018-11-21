import React, {Component} from 'react';
import {isNumber} from 'lodash-es';
import styles from './styles.scss';

export default class Range extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      dragging: null,
      width: 1
    };
  }

  componentDidMount() {
    this.setState({width: this.ref.current.offsetWidth});
  }

    startDragging = i => () => {
      this.setState({dragging: i});
      document.addEventListener('mousemove', this.onChange);
      document.addEventListener('mouseup', this.stopDragging, {once: true});

    }

    stopDragging = () => this.setState({dragging: null})

    onChange = e => {
      const {dragging, width} = this.state;
      const max = this.props.limits[1];
      if (isNumber(dragging) && this.props.value[dragging] && e.clientX >= 0 && e.clientX <= width) {
        if (dragging === 0 && ((e.clientX - 10) / width * max) < this.props.value[1]) {
          this.props.onChange([(e.clientX - 10) / width * max, this.props.value[1]]);
        }
        if (dragging === 1 && ((e.clientX - 10) / width * max) > this.props.value[0]) {
          this.props.onChange([this.props.value[0], (e.clientX - 10) / width * max]);
        }
      }
    }

    render() {
      const {value: [start, stop], limits: [min, max]} = this.props;
      const {width} = this.state;
      return (
        <div ref={this.ref} className={styles.container}>
          <div
            className={styles.selection}
            style={{width: `${(stop - start) / max * width}px`,
              transform: `translateX(${start / max * width}px)`}}
          />
          <div
            className={styles.ball}
            style={{transform: `translateX(${start / max * width}px)`}}
            onMouseDown={this.startDragging(0)}
            onMouseMove={this.onChange}
          />
          <div
            className={styles.ball}
            style={{transform: `translateX(${stop / max * width}px)`}}
            onMouseDown={this.startDragging(1)}
            onMouseMove={this.onChange}
          />
        </div>
      );
    }
}
