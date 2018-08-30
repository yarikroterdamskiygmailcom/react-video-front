import React, {Component} from 'react';
import styles from './styles.scss';

export default class Carousel extends Component {

  constructor(props) {
    super(props);
    this.carouselRef = React.createRef();
  }

  onScroll = e => this.carouselRef.current.scrollLeft += (e.deltaY * 3)

    renderItem = item =>
      <div key={item.thumb} className={styles.item} onClick={() => this.props.onClick(item)}>
        <div className={styles.thumb} style={{background: `url(${item.thumb})`}}/>
        <div className={styles.title}>{item.title || 'Untitled'}</div>
        <div className={styles.duration}>{item.duration}</div>
      </div>

    render() {
      return (
        <div className={styles.container}>
          <div className={styles.header}>{this.props.title}</div>
          <div ref={this.carouselRef} className={styles.items} onWheel={this.onScroll}>
            {this.props.items.reverse().map(this.renderItem)}
          </div>
        </div>
      );
    }
}
