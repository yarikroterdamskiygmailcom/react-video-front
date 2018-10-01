import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';

export default class Carousel extends Component {

  constructor(props) {
    super(props);
    this.carouselRef = React.createRef();
  }

  scroll = direction => () => {
    this.timer = setInterval(() => this.carouselRef.current.scrollLeft += direction * 2, 1);
  }

  stopScrolling = () => clearInterval(this.timer);

  render() {
    return !this.props.pending
      ? (
        <div className={styles.container}>
          <div className={styles.header}>{this.props.title}</div>
          <div className={styles.left} onMouseEnter={this.scroll(-1)} onMouseLeave={this.stopScrolling}>
            <FontAwesome name="chevron-left"/>
          </div>
          <div ref={this.carouselRef} className={styles.items}>
            {this.props.items.map(this.props.renderFunction)}
          </div>
          <div className={styles.right} onMouseEnter={this.scroll(1)} onMouseLeave={this.stopScrolling}>
            <FontAwesome name="chevron-right"/>
          </div>
        </div>
      )
      : <div>Loading your content...</div>;
  }
}
