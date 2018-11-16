import React, {Component} from 'react';
import {isNumber} from 'lodash-es';
import styles from './styles.scss';

export default class Range extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragging: null
    };
  }

    startDragging = i => () => {
      this.setState({dragging: i});
      document.addEventListener('mousemove', this.onChange);
      document.addEventListener('mouseup', this.stopDragging, {once: true});

    }

    stopDragging = () => this.setState({dragging: null})

    onChange = e => {
      const {dragging} = this.state;
      if (isNumber(dragging) && this.props.value[dragging]) {
        if (dragging === 0 && e.clientX - 10 < this.props.value[1]) {
          this.props.onChange([e.clientX - 10, this.props.value[1]]);
        }
        if (dragging === 1 && e.clientX - 10 > this.props.value[0]) {
          this.props.onChange([this.props.value[0], e.clientX - 10]);
        }
      }
    }

    render() {
      const {value: [start, stop], limits: [min, max]} = this.props;
      console.log(start, stop);
      return (
        <div className={styles.container}>
          <div className={styles.selection} style={{width: `${stop - start}px`, transform: `translateX(${start}px)`}} />
          <div
            className={styles.ball}
            style={{transform: `translateX(${start}px)`}}
            onMouseDown={this.startDragging(0)}
            onMouseMove={this.onChange}
          />
          <div
            className={styles.ball}
            style={{transform: `translateX(${stop}px)`}}
            onMouseDown={this.startDragging(1)}
            onMouseMove={this.onChange}
          />
        </div>
      );
    }
}
