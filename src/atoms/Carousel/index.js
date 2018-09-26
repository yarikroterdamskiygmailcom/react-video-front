import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';

export default class Carousel extends Component {

  constructor(props) {
    super(props);
    this.carouselRef = React.createRef();
  }

  scroll = direction => () => {
    this.carouselRef.current.scrollLeft += (direction * this.props.scrollStep);
  }
  render() {
    return !this.props.pending
      ? (
        <div className={styles.container}>
          <div className={styles.header}>{this.props.title}</div>
          <div className={styles.left} onClick={this.scroll(-1)}>
            <FontAwesome name="chevron-left"/>
          </div>
          <div ref={this.carouselRef} className={styles.items}>
            {this.props.items.map(this.props.renderFunction)}
          </div>
          <div className={styles.right} onClick={this.scroll(1)}>
            <FontAwesome name="chevron-right"/>
          </div>
        </div>
      )
      : <div>Loading your content...</div>;
  }
}
