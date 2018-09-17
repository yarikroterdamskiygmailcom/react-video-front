import React, {Component} from 'react';
import styles from './styles.scss';

export default class Carousel extends Component {

  constructor(props) {
    super(props);
    this.carouselRef = React.createRef();
  }

  onScroll = e => this.carouselRef.current.scrollLeft += (e.deltaY * 3)

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>{this.props.title}</div>
        <div ref={this.carouselRef} className={styles.items} onWheel={this.onScroll}>
          {this.props.items.map(this.props.renderFunction)}
        </div>
      </div>
    );
  }
}
